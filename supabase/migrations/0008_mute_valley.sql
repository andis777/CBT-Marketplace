-- Drop existing articles table if it exists
DROP TABLE IF EXISTS articles;

-- Create articles table
CREATE TABLE articles (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    preview TEXT,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    author_id VARCHAR(36) NOT NULL,
    views INT DEFAULT 0,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    institution_id VARCHAR(36) NULL,
    psychologist_id VARCHAR(36) NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL,
    FOREIGN KEY (psychologist_id) REFERENCES psychologists(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for better query performance
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_institution ON articles(institution_id);
CREATE INDEX idx_articles_psychologist ON articles(psychologist_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at);

-- Insert test article for psychologist with id = d974f49c-da47-4c42-96c2-4ff5a3cd248a
INSERT INTO articles (
    id,
    title,
    preview,
    content,
    image_url,
    author_id,
    views,
    tags,
    status,
    published_at,
    psychologist_id
) VALUES (
    'test-article-1',
    'Как справиться с тревогой: практические техники КПТ',
    'В этой статье мы рассмотрим основные техники когнитивно-поведенческой терапии для управления тревогой и научимся применять их на практике.',
    '# Как справиться с тревогой: практические техники КПТ\n\n
Тревога является естественной реакцией организма на стресс, но иногда она может стать чрезмерной и мешать повседневной жизни. В этой статье мы рассмотрим эффективные техники когнитивно-поведенческой терапии для управления тревогой.\n\n
## Что такое тревога?\n\n
Тревога – это эмоциональное состояние, характеризующееся чувством напряжения, беспокойства и физическими изменениями. Люди с тревожными расстройствами обычно имеют повторяющиеся навязчивые мысли или заботы.\n\n
## Техники КПТ для работы с тревогой\n\n
1. Когнитивное переструктурирование\n
   - Выявление негативных мыслей\n
   - Анализ доказательств\n
   - Поиск альтернативных объяснений\n\n
2. Техники релаксации\n
   - Глубокое дыхание\n
   - Прогрессивная мышечная релаксация\n
   - Медитация осознанности\n\n
3. Поведенческие эксперименты\n
   - Постепенное воздействие\n
   - Проверка убеждений на практике\n
   - Сбор объективных данных',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000&h=600',
    'd974f49c-da47-4c42-96c2-4ff5a3cd248a',
    42,
    '["КПТ", "Тревога", "Психическое здоровье", "Техники релаксации"]',
    'published',
    NOW(),
    'd974f49c-da47-4c42-96c2-4ff5a3cd248a'
);