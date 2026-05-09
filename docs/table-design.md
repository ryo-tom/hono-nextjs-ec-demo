# ECサイト テーブル設計

## admin_users（管理者）

| 物理名 | 論理名 | データ型 | 必須 | Key | Default | 説明 |
|---|---|---|---|---|---|---|
| id | ID | INT UNSIGNED | ○ | PRI | | AUTO_INCREMENT |
| email | メールアドレス | VARCHAR(255) | ○ | UNI | | ログインID |
| password | パスワード | VARCHAR(255) | ○ | | | ハッシュ済み |
| name | 表示名 | VARCHAR(100) | ○ | | | |
| created_at | 作成日時 | DATETIME | ー | | CURRENT_TIMESTAMP | |
| updated_at | 更新日時 | DATETIME | ー | | CURRENT_TIMESTAMP | 更新時に自動更新 |

## categories（カテゴリ）

| 物理名 | 論理名 | データ型 | 必須 | Key | Default | 説明 |
|---|---|---|---|---|---|---|
| id | ID | INT UNSIGNED | ○ | PRI | | AUTO_INCREMENT |
| name | カテゴリ名 | VARCHAR(100) | ○ | UNI | | |
| sort_order | 表示順 | TINYINT UNSIGNED | ○ | | 0 | |
| created_at | 作成日時 | DATETIME | ー | | CURRENT_TIMESTAMP | |
| updated_at | 更新日時 | DATETIME | ー | | CURRENT_TIMESTAMP | 更新時に自動更新 |

## products（商品）

| 物理名 | 論理名 | データ型 | 必須 | Key | Default | 説明 |
|---|---|---|---|---|---|---|
| id | ID | INT UNSIGNED | ○ | PRI | | AUTO_INCREMENT |
| category_id | カテゴリID | INT UNSIGNED | ○ | FK | | categories.id / ON DELETE RESTRICT |
| name | 商品名 | VARCHAR(255) | ○ | | | |
| description | 商品説明 | TEXT | ー | | NULL | |
| price | 価格 | INT UNSIGNED | ー | | NULL | 円単位。NULLはお問い合わせ |
| stock | 在庫数 | INT UNSIGNED | ー | | NULL | NULLは無制限 |
| published | 公開フラグ | BOOLEAN | ○ | | FALSE | FALSE:非公開 / TRUE:公開 |
| sort_order | 表示順 | SMALLINT UNSIGNED | ○ | | 0 | |
| created_at | 作成日時 | DATETIME | ー | | CURRENT_TIMESTAMP | |
| updated_at | 更新日時 | DATETIME | ー | | CURRENT_TIMESTAMP | 更新時に自動更新 |

## product_images（商品画像）

| 物理名 | 論理名 | データ型 | 必須 | Key | Default | 説明 |
|---|---|---|---|---|---|---|
| id | ID | INT UNSIGNED | ○ | PRI | | AUTO_INCREMENT |
| product_id | 商品ID | INT UNSIGNED | ○ | FK | | products.id / ON DELETE CASCADE |
| image_url | 画像URL | VARCHAR(2083) | ○ | | | 画像ファイルのパス/URL |
| alt_text | 代替テキスト | VARCHAR(255) | ー | | NULL | 画像のalt属性 |
| sort_order | 表示順 | TINYINT UNSIGNED | ○ | | 0 | |
| created_at | 作成日時 | DATETIME | ー | | CURRENT_TIMESTAMP | |
| updated_at | 更新日時 | DATETIME | ー | | CURRENT_TIMESTAMP | 更新時に自動更新 |