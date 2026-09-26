import os
import json
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

# Tự động nạp biến môi trường từ .env.local ở thư mục gốc dự án
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env.local')
load_dotenv(env_path)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

def safe_int(val, default=0):
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return default

def create_sample_excel(filename):
    """Tạo file Excel mẫu 1-page với bài đọc hạt giống nếu chưa tồn tại"""
    if os.path.exists(filename):
        print(f"File {filename} đã tồn tại. Bỏ qua tạo mới.")
        return

    data = {
        "Field": [
            "title", "slug", "category", "target_grade", "estimated_minutes", "hero_image_url", "content_raw",
            "p1_text", "p1_say_aloud", 
            "p2_text", "p2_ask_child", 
            "p3_text", "p3_say_aloud", 
            "p4_text", "p4_ask_child",
            "org_title", "org_slot1_label", "org_slot2_label", "org_slot3_label", 
            "org_card1_text", "org_card2_text", "org_card3_text",
            "recip_predict", "recip_clarify", "recip_question", "recip_summarize",
            "qar1_question", "qar1_options", "qar1_correct_idx",
            "qar2_question", "qar2_options", "qar2_correct_idx",
            "qar3_question",
            "paper_task", "book_title", "book_author"
        ],
        "Article_1": [
            "Hải Lưu Kỳ Bí và Cỗ Máy Nhiệt Cầu Đại Dương",
            "hai-luu-ky-bi-nhiet-cau",
            "khoa-hoc",
            7,
            20,
            "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&q=80&w=1600",
            "Nếu bạn nghĩ đại dương chỉ là một khối nước tĩnh lặng, bạn đã nhầm to! Dưới mặt biển sâu thẳm ẩn chứa một 'cỗ máy' khổng lồ liên tục hoạt động suốt hàng triệu năm qua. Cỗ máy này không chạy bằng điện hay xăng dầu, mà bằng sự chênh lệch nhiệt độ và độ mặn. Người ta gọi nó là 'Băng chuyền đại dương toàn cầu' (Global Ocean Conveyor Belt).\n\nBạn có tự hỏi: Làm thế nào nước biển lại di chuyển liên tục từ đầu này đến đầu kia của Trái Đất? Bí mật nằm ở hai cực băng giá. Khi nước biển chảy về Bắc Cực, nó trở nên cực kỳ lạnh. Nước lạnh đặc hơn và nặng hơn nước ấm, nên nó chìm sâu xuống đáy biển. Quá trình chìm này tạo ra một lực hút khổng lồ, kéo thêm nhiều nước ấm từ xích đạo chảy lên phía Bắc để thế chỗ.\n\nNhưng đợi đã, nếu nước cứ chìm xuống thì nó đi đâu? Dòng nước siêu lạnh và siêu mặn dưới đáy biển này bắt đầu hành trình dài dằng dặc dọc theo đáy đại dương, di chuyển từ Đại Tây Dương xuống tận Nam Cực, sau đó vòng qua Ấn Độ Dương và Thái Bình Dương. Trải qua hàng ngàn năm, dòng nước sâu này dần nóng lên, nhẹ đi và từ từ trồi lên mặt biển.\n\nSự vận hành của 'Băng chuyền đại dương' cực kỳ quan trọng đối với khí hậu toàn cầu. Nó giống như một hệ thống sưởi trung tâm: mang nhiệt từ xích đạo đến sưởi ấm các nước Bắc Âu. Tuy nhiên, nếu nhiệt độ toàn cầu tiếp tục tăng làm tan chảy các khối băng khổng lồ, lượng nước ngọt đồ sộ đổ vào biển có thể làm loãng độ mặn, khiến nước không đủ nặng để chìm xuống. Điều gì sẽ xảy ra nếu cỗ máy vĩ đại này... đột ngột ngừng hoạt động?",
            "Nếu bạn nghĩ đại dương chỉ là một khối nước tĩnh lặng, bạn đã nhầm to! Dưới mặt biển sâu thẳm ẩn chứa một 'cỗ máy' khổng lồ liên tục hoạt động suốt hàng triệu năm qua. Cỗ máy này không chạy bằng điện hay xăng dầu, mà bằng sự chênh lệch nhiệt độ và độ mặn. Người ta gọi nó là 'Băng chuyền đại dương toàn cầu' (Global Ocean Conveyor Belt).",
            "Con hãy chú ý nhé, đại dương không hề đứng yên. Nó là một cỗ máy khổng lồ chạy bằng nhiệt độ và độ mặn đấy. Cha rất tò mò cỗ máy này hoạt động thế nào.",
            "Bạn có tự hỏi: Làm thế nào nước biển lại di chuyển liên tục từ đầu này đến đầu kia của Trái Đất? Bí mật nằm ở hai cực băng giá. Khi nước biển chảy về Bắc Cực, nó trở nên cực kỳ lạnh. Nước lạnh đặc hơn và nặng hơn nước ấm, nên nó chìm sâu xuống đáy biển. Quá trình chìm này tạo ra một lực hút khổng lồ, kéo thêm nhiều nước ấm từ xích đạo chảy lên phía Bắc để thế chỗ.",
            "Tại sao nước lạnh lại chìm xuống đáy biển hả con? Điều này gây ra hiện tượng gì tiếp theo?",
            "Nhưng đợi đã, nếu nước cứ chìm xuống thì nó đi đâu? Dòng nước siêu lạnh và siêu mặn dưới đáy biển này bắt đầu hành trình dài dằng dặc dọc theo đáy đại dương, di chuyển từ Đại Tây Dương xuống tận Nam Cực, sau đó vòng qua Ấn Độ Dương và Thái Bình Dương. Trải qua hàng ngàn năm, dòng nước sâu này dần nóng lên, nhẹ đi và từ từ trồi lên mặt biển.",
            "Cha thấy đoạn này rất thú vị. Dòng nước đi một vòng rất dài qua các đại dương rồi lại trồi lên. Giống như một vòng tuần hoàn không bao giờ dứt.",
            "Sự vận hành của 'Băng chuyền đại dương' cực kỳ quan trọng đối với khí hậu toàn cầu. Nó giống như một hệ thống sưởi trung tâm: mang nhiệt từ xích đạo đến sưởi ấm các nước Bắc Âu. Tuy nhiên, nếu nhiệt độ toàn cầu tiếp tục tăng làm tan chảy các khối băng khổng lồ, lượng nước ngọt đồ sộ đổ vào biển có thể làm loãng độ mặn, khiến nước không đủ nặng để chìm xuống. Điều gì sẽ xảy ra nếu cỗ máy vĩ đại này... đột ngột ngừng hoạt động?",
            "Con thử tưởng tượng xem, nếu cỗ máy này ngừng hoạt động thì khí hậu trên Trái Đất sẽ thay đổi đáng sợ như thế nào?",
            "Sơ đồ nhân quả Băng chuyền đại dương",
            "Nước lạnh và mặn chìm xuống",
            "Tạo lực hút kéo nước ấm tới",
            "Mang nhiệt đi sưởi ấm Trái Đất",
            "Làm nước biển chìm xuống đáy",
            "Nước ấm từ xích đạo lấp chỗ trống",
            "Điều hòa khí hậu toàn cầu",
            "Dự đoán xem băng tan sẽ ảnh hưởng thế nào đến dòng chảy?",
            "Làm rõ từ 'Băng chuyền đại dương toàn cầu' nghĩa là gì?",
            "Đặt một câu hỏi về lý do nước chìm xuống.",
            "Tóm tắt cơ chế hoạt động của dòng hải lưu trong 1 câu.",
            "Băng chuyền đại dương hoạt động dựa trên yếu tố nào?",
            "Động cơ điện|Gió và bão|Sự chênh lệch nhiệt độ và độ mặn|Thủy triều",
            "2",
            "Theo bài viết, nếu nhiệt độ toàn cầu tăng lên thì băng chuyền đại dương có thể bị ảnh hưởng như thế nào?",
            "Chạy nhanh hơn|Dừng hoạt động do nước ngọt làm loãng độ mặn|Nước biển nóng lên sẽ chìm nhanh hơn|Không có ảnh hưởng gì",
            "1",
            "Nếu con là một nhà môi trường học, con sẽ đề xuất giải pháp gì để bảo vệ cỗ máy vĩ đại này?",
            "Viết một đoạn văn ngắn miêu tả hành trình của một giọt nước trong băng chuyền đại dương.",
            "Hành Trình Khám Phá Đại Dương",
            "Nhiều Tác Giả"
        ]
    }

    df = pd.DataFrame(data)
    df.to_excel(filename, index=False)
    print(f"Đã tạo file mẫu: {filename}")

def import_1page_to_supabase(filename="articles_1page_template.xlsx"):
    """Đọc file Excel dọc, dựng JSON structured_data chuẩn và nạp vào Supabase"""
    if not os.path.exists(filename):
        print(f"Lỗi: Không tìm thấy file {filename}")
        return

    df = pd.read_excel(filename)
    df['Field'] = df['Field'].astype(str).str.strip()
    df.set_index('Field', inplace=True)
    df = df.T 

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    for article_col, row in df.iterrows():
        if pd.isna(row.get("title")) or not str(row.get("title")).strip():
            continue

        slug = str(row["slug"]).strip()

        # Kiểm tra bỏ qua bài đã tồn tại
        existing = supabase.table("one_page_articles").select("id").eq("slug", slug).execute()
        if existing.data and len(existing.data) > 0:
            print(f"- [Bỏ qua] Bài '{row['title']}' đã có trên hệ thống.")
            continue

        print(f"\nĐang xử lý bài đọc 1-Page mới: {row['title']} (slug: {slug})...")

        def parse_options(opt_str):
            if pd.isna(opt_str):
                return []
            return [opt.strip() for opt in str(opt_str).split("|") if opt.strip()]

        paragraphs = []
        p_fields = [
            ("p1", "parent", "p1_text", "p1_say_aloud", "Cha làm mẫu suy nghĩ to thành tiếng để định hướng hình dung."),
            ("p2", "student", "p2_text", "p2_ask_child", "Gợi ý con quan sát chi tiết mấu chốt trong đoạn."),
            ("p3", "parent", "p3_text", "p3_say_aloud", "Cha tiếp tục định hướng suy nghĩ cho đoạn tiếp theo."),
            ("p4", "student", "p4_text", "p4_ask_child", "Kiểm tra sự hiểu biết và suy luận của con.")
        ]
        
        for p_id, actor, text_field, coach_field, focus in p_fields:
            text = str(row.get(text_field, "")).strip()
            coach = str(row.get(coach_field, "")).strip()
            if text:
                para = {
                    "id": p_id,
                    "actor": actor,
                    "text": text,
                    "parent_coaching": {
                        "pedagogical_focus": focus
                    }
                }
                if actor == "parent":
                    para["parent_coaching"]["say_aloud_script"] = coach
                else:
                    para["parent_coaching"]["ask_child_prompt"] = coach
                paragraphs.append(para)

        category_val = str(row.get("category", "")).strip()
        
        structured_data = {
            "article_meta": {
                "slug": slug,
                "topic": category_val,
                "target_grade": safe_int(row.get("target_grade"), 7),
                "estimated_minutes": safe_int(row.get("estimated_minutes"), 20),
                "page_count": 1
            },
            "step_0_immersion": {
                "hero_image_url": str(row.get("hero_image_url", "")).strip(),
                "prediction_prompt": f"Quan sát tiêu đề '{row.get('title')}' và bức ảnh trên, con dự đoán bài viết này sẽ nói về hiện tượng hay câu chuyện gì?"
            },
            "step_1_think_aloud": {
                "paragraphs": paragraphs
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
            "estimated_minutes": safe_int(row.get("estimated_minutes"), 20),
            "page_count": 1,
            "hero_image_url": str(row.get("hero_image_url", "")).strip(),
            "content_raw": str(row.get("content_raw", "")).strip(),
            "structured_data": structured_data,
            "is_published": True
        }

        res = supabase.table("one_page_articles").upsert(payload, on_conflict="slug").execute()
        print(f"-> Nạp thành công bài: {row['title']} lên Supabase!")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    excel_path = os.path.join(current_dir, "articles_1page_template.xlsx")
    create_sample_excel(excel_path)
    import_1page_to_supabase(excel_path)
