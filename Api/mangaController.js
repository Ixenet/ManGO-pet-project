const client = require('./dataBaseClient');

class mangaController {
    async addManga (req, res) {
        const {title, cover_url, release_date, rating, views} = req.body.main_info;
        const {alternate_title, author, description, genres, tags, status, artist, age_rating} = req.body.details;
    
        try {
            await client.query('BEGIN');
    
            const mangaInsert = `INSERT INTO manga (title, cover_url, release_date, rating, views)
            VALUES ($1, $2, $3, $4, $5) RETURNING ID`;
            const mangaInsertResult = await client.query(mangaInsert, [title, cover_url, release_date, rating, views]);
    
            const mangaId = mangaInsertResult.rows[0].id;
    
            const detailsInsert = `INSERT INTO manga_details (id, alternate_title, author, description, genres, tags, status, artist, age_rating)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING ID`
            await client.query(detailsInsert, [mangaId, alternate_title, author, description, genres, tags, status, artist, age_rating]); 
    
            await client.query('COMMIT');
    
            res.status(200).send("Manga added successfully!"); 
        } catch (err) {
            await client.query('ROLLBACK');
            console.error(`Error inserting data: ${err}`);
            res.status(500).send('Error inserting data');
        }
    }

    async addNews(req,res){
        let {title, post_date, author, cover_url} = req.body.main_info;
        let {content, rating, views, related_to} = req.body.details;
        post_date = post_date || new Date();
    
        try{
            await client.query('BEGIN');
    
            const newsInsert = `INSERT INTO news (title, post_date, author, cover_url)
            VALUES ($1, $2, $3, $4) RETURNING ID`;
            const newsInsertResult = await client.query(newsInsert, [title, post_date, author, cover_url]);
    
            const newsId = newsInsertResult.rows[0].id;
    
            const detailsInsert = `INSERT INTO news_details (id, content, rating, views, related_to)
            VALUES ($1, $2, $3, $4, $5) RETURNING ID`
            await client.query(detailsInsert, [newsId, content, rating, views, related_to]); 
    
            await client.query('COMMIT');
    
            res.status(200).send("News added successfully!"); 
        } catch(err){
            console.error(`Error inserting data: ${err}`);
            res.status(500).send('Error inserting data');
        }
    }

    async getManga(req, res){
        let limit = '';
        let filter = 'WHERE 1 = 1';
    
        if (req.query.limit && !isNaN(req.query.limit)) {
            limit = `LIMIT ${parseInt(req.query.limit, 10)}`;
        }
    
        if (req.query.filter === 'age') {
            filter += ` AND id IN (SELECT id FROM manga_details WHERE age_rating < 18)`;
        }
    
        if (req.query.completed === 'true') {
            filter += ` AND id IN (SELECT id FROM manga_details WHERE status = 'Released')`;
        }
    
        if (req.query.release_date) {
            filter += ` AND EXTRACT(YEAR FROM release_date) >= ${parseInt(req.query.release_date, 10)}`;
        }
    
        try {
            const result = await client.query(`SELECT * FROM manga ${filter} ORDER BY views DESC ${limit}`);
    
            res.status(200).json(result.rows); 
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
        }
    }

    async getNews(req, res){
        let limit = '';
    
        if (req.query.limit && !isNaN(req.query.limit)) {
            limit = `LIMIT ${parseInt(req.query.limit, 10)}`;
        }
    
        try{
            const result = await client.query(`SELECT * FROM news ORDER BY post_date DESC ${limit}`);
            res.status(200).json(result.rows);
        } catch(err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
        }
    }

    async getNewsById(req, res) {
        const id = !isNaN(req.params.id) ? req.params.id : null;
    
        try {
            if(id) {
                const mainInfo = await client.query('SELECT * FROM news WHERE id = $1', [id]);
                const details = await client.query('SELECT * FROM news_details WHERE id = $1', [id]);
    
                if (mainInfo.rows.length === 0 || details.rows.length === 0) {
                    throw new Error("News not found");
                }
    
                const result = {
                    mainInfo: mainInfo.rows[0],
                    details: details.rows[0]
                };
    
                return res.status(200).json(result);
            } else {
                console.error('ID must be provided');
                return res.status(500).send('ID must be provided');
            }
        } catch(err) {
            console.error('Error fetching data:', err);
            return res.status(500).send(`Error fetching data: ${err}`);
        }
    }

    async getMangaByKey(req, res) {
        const key = req.params.key; 
        try {
            if (!isNaN(key)) {
                const mainInfo = await client.query('SELECT * FROM manga WHERE id = $1', [key]);
                const details = await client.query('SELECT * FROM manga_details WHERE id = $1', [key]);
    
                if (mainInfo.rows.length === 0 || details.rows.length === 0) {
                    throw new Error("Manga not found");
                }
    
                const result = {
                    mainInfo: mainInfo.rows[0],
                    details: details.rows[0]
                };
                return res.status(200).json(result);
    
            } else if (key) {
                const details = await client.query('SELECT * FROM manga_details WHERE $1 = ANY(genres) LIMIT 5', [key]);
    
                if (details.rows.length === 0) {
                    throw new Error("No manga found with this genre");
                }
    
                const ids = details.rows.map(row => row.id);
                const mainInfo = await client.query('SELECT * FROM manga WHERE id = ANY($1::int[]) LIMIT 5', [ids]);
    
                return res.status(200).json(mainInfo.rows);
            } else {
                throw new Error("ID or genre must be provided");
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Error fetching data');
        }
    }

    async deleteManga(req, res){
        const { id } = req.body;

        try {
            await client.query(`DELETE FROM manga WHERE id = $1`, [id]);
            res.status(200).json({'messgae': 'Manga deleted successfully'}); 
        } catch (err) {
            console.error('Error deleting data:', err);
            res.status(500).send('Error deleting data');
        }
    }
}

module.exports = new mangaController();