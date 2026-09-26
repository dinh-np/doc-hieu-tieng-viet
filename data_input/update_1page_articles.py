import os
import json
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env.local')
load_dotenv(env_path)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

def safe_int(val, default=0):
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return default

def update_1page_in_supabase(filename="articles_1page_template.xlsx"):
    """Cập nhật dữ liệu từ file Excel lên Supabase cho bảng one_page_articles (Ghi đè bài đã có)"""
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
        print(f"\nĐang cập nhật bài đọc: {row['title']} (slug: {slug})...")

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
        print(f"-> Cập nhật thành công bài: {row['title']} lên Supabase!")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    excel_path = os.path.join(current_dir, "articles_1page_template.xlsx")
    update_1page_in_supabase(excel_path)
