-- 1. Kích hoạt extension hỗ trợ sinh UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Bảng hồ sơ người dùng (Profiles - gia đình dùng chung 1 tài khoản)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  family_name TEXT NOT NULL DEFAULT 'Gia đình',
  student_name TEXT NOT NULL,
  grade_level INT DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng bài đọc (Reading Articles)
CREATE TABLE IF NOT EXISTS reading_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'thoi-tiet', 'khoa-hoc', 'lich-su', 'dia-ly'
  target_grade INT NOT NULL DEFAULT 7,
  estimated_minutes INT DEFAULT 15,
  hero_image_url TEXT,
  content_raw TEXT NOT NULL,
  structured_data JSONB NOT NULL, -- Toàn bộ kịch bản 5 bước
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng phiên đọc thời gian thực & lịch sử (Reading Sessions)
CREATE TABLE IF NOT EXISTS user_reading_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  article_id UUID REFERENCES reading_articles(id) ON DELETE CASCADE,
  current_step INT DEFAULT 0 CHECK (current_step BETWEEN 0 AND 5),
  completed_steps INT[] DEFAULT ARRAY[]::INT[],
  organizer_state JSONB DEFAULT '{}'::jsonb,
  qar_answers JSONB DEFAULT '{}'::jsonb,
  student_summary TEXT,
  parent_notes TEXT,
  status TEXT CHECK (status IN ('in_progress', 'completed')) DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bảng yếu tố đơn vị Hán - Việt (Root Morphemes)
CREATE TABLE IF NOT EXISTS han_viet_roots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hanzi TEXT,
  reading_vi TEXT NOT NULL UNIQUE, -- "Hải", "Đăng", "Nghịch", "Lý"...
  root_meaning TEXT NOT NULL,      -- "Biển", "Cây đèn", "Trái ngược", "Lẽ phải"...
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Bảng từ ghép Hán - Việt (Compound Words)
CREATE TABLE IF NOT EXISTS han_viet_compounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT NOT NULL UNIQUE,       -- "Hải đăng", "Nghịch lý", "Phục hưng"
  slug TEXT NOT NULL UNIQUE,
  full_meaning TEXT NOT NULL,
  example_sentence TEXT NOT NULL,
  math_formula TEXT NOT NULL,      -- "Hải (biển) + Đăng (đèn) -> Ngọn đèn soi đường trên biển"
  subject_tag TEXT NOT NULL,       -- 'ngu-van', 'lich-su', 'dia-ly', 'khoa-hoc'
  grade_level INT DEFAULT 7,
  quiz_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Bảng liên kết chiết tự (Mối quan hệ N-N giữa Từ ghép và Từ tố)
CREATE TABLE IF NOT EXISTS compound_root_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  compound_id UUID REFERENCES han_viet_compounds(id) ON DELETE CASCADE,
  root_id UUID REFERENCES han_viet_roots(id) ON DELETE CASCADE,
  position_order INT NOT NULL,     -- 1: Yếu tố trước, 2: Yếu tố sau
  related_words TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- 8. Bảng khu vườn từ vựng đã thu thập (Etymology Garden)
CREATE TABLE IF NOT EXISTS etymology_garden (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  compound_id UUID REFERENCES han_viet_compounds(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, compound_id)
);

-- ==========================================
-- BẬT ROW LEVEL SECURITY (RLS) & TẠO POLICIES
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE han_viet_roots ENABLE ROW LEVEL SECURITY;
ALTER TABLE han_viet_compounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE compound_root_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE etymology_garden ENABLE ROW LEVEL SECURITY;

-- Xóa policies cũ nếu đã tồn tại trước đó để tránh lỗi trùng lặp
DROP POLICY IF EXISTS "Profiles are owner managed" ON profiles;
DROP POLICY IF EXISTS "Public articles are viewable" ON reading_articles;
DROP POLICY IF EXISTS "Sessions are family managed" ON user_reading_sessions;
DROP POLICY IF EXISTS "Public dictionary roots" ON han_viet_roots;
DROP POLICY IF EXISTS "Public dictionary compounds" ON han_viet_compounds;
DROP POLICY IF EXISTS "Public dictionary links" ON compound_root_links;
DROP POLICY IF EXISTS "Etymology garden is family managed" ON etymology_garden;

-- Tạo các chính sách bảo mật
CREATE POLICY "Profiles are owner managed" ON profiles 
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Public articles are viewable" ON reading_articles 
  FOR SELECT USING (is_published = true);

CREATE POLICY "Sessions are family managed" ON user_reading_sessions 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public dictionary roots" ON han_viet_roots 
  FOR SELECT USING (true);

CREATE POLICY "Public dictionary compounds" ON han_viet_compounds 
  FOR SELECT USING (true);

CREATE POLICY "Public dictionary links" ON compound_root_links 
  FOR SELECT USING (true);

CREATE POLICY "Etymology garden is family managed" ON etymology_garden 
  FOR ALL USING (auth.uid() = user_id);
