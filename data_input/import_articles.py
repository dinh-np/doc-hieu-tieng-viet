import os
import json
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

# Tự động nạp biến môi trường từ .env.local ở thư mục gốc dự án
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env.local')
load_dotenv(env_path)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
# Ưu tiên service role key nếu có để bỏ qua RLS khi nạp dữ liệu quản trị
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

def safe_int(val, default=0):
    """Ép kiểu số an toàn kể cả khi Excel đọc ra số thực float 7.0 hoặc chuỗi"""
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return default

def import_excel_to_supabase(filename="articles_template.xlsx"):
    """Đọc file Excel dọc, dựng JSON structured_data chuẩn và nạp vào Supabase"""
    if not os.path.exists(filename):
        print(f"Lỗi: Không tìm thấy file {filename}")
        return

    df = pd.read_excel(filename)
    
    # 1. Chuẩn hóa tên trường: Xóa khoảng trắng thừa ở đầu/cuối tên field
    df['Field'] = df['Field'].astype(str).str.strip()
    
    # 2. Xoay ngang dữ liệu (Transpose)
    df.set_index('Field', inplace=True)
    df = df.T # Mỗi hàng bây giờ tương ứng với 1 bài viết (Article_1, Article_2...)

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    for article_col, row in df.iterrows():
        # Bỏ qua nếu dòng/cột chưa có tiêu đề bài viết
        if pd.isna(row.get("title")) or not str(row.get("title")).strip():
            continue

        slug = str(row["slug"]).strip()

        # --- ĐOẠN KIỂM TRA BỎ QUA BÀI ĐÃ TỒN TẠI ---
        existing = supabase.table("reading_articles").select("id").eq("slug", slug).execute()
        if existing.data and len(existing.data) > 0:
            print(f"- [Bỏ qua] Bài '{row['title']}' đã có trên hệ thống.")
            continue
        # ------------------------------------------

        print(f"\nĐang xử lý bài đọc mới: {row['title']} (slug: {slug})...")

        # Xử lý an toàn danh sách các lựa chọn trắc nghiệm
        def parse_options(opt_str):
            if pd.isna(opt_str):
                return []
            return [opt.strip() for opt in str(opt_str).split("|") if opt.strip()]

        # Dựng cấu trúc JSON structured_data khớp 100% với JSON Contract
        structured_data = {
            "article_meta": {
                "slug": slug,
                "topic": str(row.get("category", "")).strip(),
                "target_grade": safe_int(row.get("target_grade"), 7),
                "estimated_minutes": safe_int(row.get("estimated_minutes"), 15)
            },
            "step_0_immersion": {
                "hero_image_url": str(row.get("hero_image_url", "")).strip(),
                "prediction_prompt": f"Quan sát tiêu đề '{row.get('title')}' và bức ảnh trên, con dự đoán bài viết này sẽ nói về hiện tượng hay câu chuyện gì?"
            },
            "step_1_think_aloud": {
                "paragraphs": [
                    {
                        "id": "p1",
                        "actor": "parent",
                        "text": str(row.get("p1_text", "")).strip(),
                        "parent_coaching": {
                            "say_aloud_script": str(row.get("p1_say_aloud", "")).strip(),
                            "pedagogical_focus": "Cha làm mẫu suy nghĩ to thành tiếng để định hướng hình dung."
                        }
                    },
                    {
                        "id": "p2",
                        "actor": "student",
                        "text": str(row.get("p2_text", "")).strip(),
                        "parent_coaching": {
                            "ask_child_prompt": str(row.get("p2_ask_child", "")).strip(),
                            "visual_hint": "Gợi ý con quan sát chi tiết mấu chốt trong đoạn."
                        }
                    }
                ]
            },
            "step_2_graphic_organizer": {
                "type": "cause_and_effect",
                "title": str(row.get("org_title", "Sơ đồ tư duy")).strip(),
                "slots": [
                    {"id": "slot_1", "label": str(row.get("org_slot1_label", "")).strip(), "expected_card_id": "card_1"},
                    {"id": "slot_2", "label": str(row.get("org_slot2_label", "")).strip(), "expected_card_id": "card_2"},
                    {"id": "slot_3", "label": str(row.get("org_slot3_label", "")).strip(), "expected_card_id": "card_3"}
                ],
                "cards": [
                    {"id": "card_1", "text": str(row.get("org_card1_text", "")).strip()},
                    {"id": "card_2", "text": str(row.get("org_card2_text", "")).strip()},
                    {"id": "card_3", "text": str(row.get("org_card3_text", "")).strip()}
                ]
            },
            "step_3_reciprocal_cards": [
                {"role": "Predict", "task": str(row.get("recip_predict", "")).strip()},
                {"role": "Clarify", "task": str(row.get("recip_clarify", "")).strip()},
                {"role": "Question", "task": str(row.get("recip_question", "")).strip()},
                {"role": "Summarize", "task": str(row.get("recip_summarize", "")).strip()}
            ],
            "step_4_qar_questions": [
                {
                    "id": "qar_1",
                    "level": "right_there",
                    "level_name": "Đọc Thẳng (Right There)",
                    "color_tag": "amber-500",
                    "question": str(row.get("qar1_question", "")).strip(),
                    "options": parse_options(row.get("qar1_options")),
                    "correct_index": safe_int(row.get("qar1_correct_idx"), 0)
                },
                {
                    "id": "qar_2",
                    "level": "think_and_search",
                    "level_name": "Suy Luận (Think & Search)",
                    "color_tag": "emerald-500",
                    "question": str(row.get("qar2_question", "")).strip(),
                    "options": parse_options(row.get("qar2_options")),
                    "correct_index": safe_int(row.get("qar2_correct_idx"), 0)
                },
                {
                    "id": "qar_3",
                    "level": "author_and_me",
                    "level_name": "Suy Nghĩ Sâu (Author & Me)",
                    "color_tag": "purple-500",
                    "question": str(row.get("qar3_question", "")).strip(),
                    "open_ended": True
                }
            ],
            "step_5_screen_to_paper": {
                "handwritten_task": str(row.get("paper_task", "")).strip(),
                "offline_books": [{
                    "title": str(row.get("book_title", "")).strip(),
                    "author": str(row.get("book_author", "")).strip()
                }]
            }
        }

        payload = {
            "title": str(row["title"]).strip(),
            "slug": slug,
            "category": str(row.get("category", "khoa-hoc")).strip(),
            "target_grade": safe_int(row.get("target_grade"), 7),
            "estimated_minutes": safe_int(row.get("estimated_minutes"), 15),
            "hero_image_url": str(row.get("hero_image_url", "")).strip(),
            "content_raw": str(row.get("content_raw", "")).strip(),
            "structured_data": structured_data,
            "is_published": True
        }

        # Nạp dữ liệu vào bảng reading_articles, nếu trùng slug sẽ cập nhật bài cũ
        res = supabase.table("reading_articles").upsert(payload, on_conflict="slug").execute()
        print(f"-> Nạp thành công bài: {row['title']} lên Supabase!")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    excel_path = os.path.join(current_dir, "articles_template.xlsx")
    
    # Bước 1: Khởi tạo file Excel mẫu (đã tạo xong nên tắt đi)
    # create_sample_excel(excel_path)
    
    # Bước 2: Kích hoạt đẩy dữ liệu lên Supabase
    import_excel_to_supabase(excel_path)

    # Lệnh chạy "python data_input/import_articles.py"
