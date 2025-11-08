--
--DROP TABLE IF EXISTS book_rent;
--DROP TABLE IF EXISTS book_rents;
--DROP TABLE IF EXISTS user_role_junction;
--DROP TABLE IF EXISTS m_users CASCADE;
--DROP TABLE IF EXISTS m_books CASCADE;
--DROP TABLE IF EXISTS m_members CASCADE;
--DROP TABLE IF EXISTS m_roles CASCADE;


INSERT INTO m_roles (role_id, authority) VALUES
(gen_random_uuid(), 'ADMIN'),
(gen_random_uuid(), 'USER')
ON CONFLICT (authority) DO NOTHING;

INSERT INTO m_members (member_id, name, email, join_date) VALUES
('M-001', 'Budi Setiawan', 'budi.member@example.com', CURRENT_DATE),
('M-002', 'Siti Aminah', 'siti.member@example.com', CURRENT_DATE - 10)
ON CONFLICT (member_id) DO NOTHING;

INSERT INTO m_books (isbn, title, author, publisher, publication_year, stock) VALUES
('978-602-03-2679-0', 'Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, 5),
('978-979-3062-79-0', 'Bumi Manusia', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1980, 3),
('978-602-06-3829-9', 'Atomic Habits', 'James Clear', 'Gramedia Pustaka Utama', 2018, 10)
ON CONFLICT (isbn) DO NOTHING;

INSERT INTO m_users (user_id, username, password, email, api_key, member_id) VALUES
(
    gen_random_uuid(),
    'admin',
    '$2a$10$c1/W2A8cO8h5lMh8f.XjjuY.cKj3Gg92i6e.pMMLv9UW17nKOrlUu',
    'admin@example.com',
    gen_random_uuid(),
    NULL
),
(
    gen_random_uuid(),
    'member',
    '$2a$10$wTQrj.CFKz5tJmN/R.bLVe0S8bXg.HjZJ.6N9W.sJb0FasW5oMvGa',
    'budi.member@example.com',
    gen_random_uuid(),
    (SELECT id FROM m_members WHERE member_id = 'M-001')
)
ON CONFLICT (username) DO NOTHING;

INSERT INTO user_role_junction (user_id, role_id) VALUES
(
    (SELECT user_id FROM m_users WHERE username = 'admin'),
    (SELECT role_id FROM m_roles WHERE authority = 'ADMIN')
),
(
    (SELECT user_id FROM m_users WHERE username = 'member'),
    (SELECT role_id FROM m_roles WHERE authority = 'USER')
)
ON CONFLICT (user_id, role_id) DO NOTHING;

INSERT INTO book_rents (rent_date, due_date, return_date, status, member_id, book_id) VALUES
(
    CURRENT_DATE - 7, 
    CURRENT_DATE + 7, 
    NULL, 
    'BORROWED', 
    (SELECT id FROM m_members WHERE member_id = 'M-001'), 
    (SELECT id FROM m_books WHERE isbn = '978-979-3062-79-0')
),
(
    CURRENT_DATE - 30, 
    CURRENT_DATE - 16, 
    CURRENT_DATE - 10, 
    'RETURNED', 
    (SELECT id FROM m_members WHERE member_id = 'M-001'), 
    (SELECT id FROM m_books WHERE isbn = '978-602-03-2679-0')
),
(
    CURRENT_DATE - 20, 
    CURRENT_DATE - 6, 
    NULL, 
    'OVERDUE', 
    (SELECT id FROM m_members WHERE member_id = 'M-002'), 
    (SELECT id FROM m_books WHERE isbn = '978-602-06-3829-9')
)
ON CONFLICT (id) DO NOTHING;