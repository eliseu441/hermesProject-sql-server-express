//----------const dbFIBRA = require('../bds/FIBRA');
const dbFIBRA = require('../../database/sqlserver');
const IntlBr = require('intl');
const excel = require('exceljs');


const ValidationError = require('../../errors/ValidationError');
class ArtGallery {

    constructor() {

    }
    async getVolumeSites(params) {
        try {
            const sql = await dbFIBRA.query(`
            SELECT  [ID]
            ,[TYPE]
            ,[TYPE_DESCRIPTION]
        FROM [ART_GALLERY].[dbo].[TBF_TYPES]
            `);
            return sql
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getAllArts(params) {
        try {
            let id_artitst = params.id ? parseInt(params.id)  : 1
            let where = { conditions: [], inputs: [] };
                
                where.conditions.push(`AND A.ID_ARTIST = ${id_artitst}`)
                where.inputs.push({ key: 'ID_ARTIST', type: dbFIBRA.Int, value: 1 })

                
            const res = await dbFIBRA.query(`
                SELECT TOP(7)
                CAST (ROW_NUMBER() OVER (ORDER BY A.PAINT_NAME  ) AS INT) AS ID_INDEX
                ,B.NAME
                ,A.ID_ARTIST
                ,A.PAINT_NAME
                ,A.YEAR
                ,A.FILE_NAME
                FROM [ART_GALLERY].[dbo].[TBF_RELATION_ART_ARTISTS] A
                INNER JOIN TBF_ARTISTS  B ON  A.ID_ARTIST = B.ID
                WHERE 1=1 ${where.conditions.join(' ')}

                ORDER BY ID_INDEX DESC
            `);
            return res
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getSculpCarousel(params) {
        try {
            let id_artitst = params.id ? parseInt(params.id)  : 10
            let where = { conditions: [], inputs: [] };
                
                where.conditions.push(`AND A.ID_ARTIST = ${id_artitst}`)
                where.inputs.push({ key: 'ID_ARTIST', type: dbFIBRA.Int, value: 10 })

                
            const res = await dbFIBRA.query(`
            SELECT 
            CAST (ROW_NUMBER() OVER (ORDER BY A.SCULPTURE  ) AS INT) AS ID_INDEX
            ,B.NAME
            ,A.ID_ARTIST
            ,A.SCULPTURE
            ,A.YEAR
            ,A.FILE_NAME
            FROM [ART_GALLERY].[dbo].[TBF_RELATION_SCULPTURE_ARTISTS] A
            INNER JOIN TBF_ARTISTS  B ON  A.ID_ARTIST = B.ID
                WHERE 1=1 ${where.conditions.join(' ')}

                ORDER BY ID_INDEX ASC
            `);
            return res
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getPaintersCombo(params) {
        try {
            const sql = await dbFIBRA.query(`
            SELECT DISTINCT A.ID
            ,NAME
            FROM [ART_GALLERY].[dbo].[TBF_ARTISTS] AS A 
            INNER JOIN TBF_RELATION_ART_ARTISTS AS B ON A.ID = B.ID_ARTIST
            `);
            return sql
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getSculptorsCombo(params) {
        try {
            const sql = await dbFIBRA.query(`
            
                
            SELECT DISTINCT A.ID
            ,NAME
            FROM [ART_GALLERY].[dbo].[TBF_ARTISTS] AS A 
            INNER JOIN TBF_RELATION_SCULPTURE_ARTISTS AS B ON A.ID = B.ID_ARTIST
          
            `);
            return sql
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
}

module.exports = new ArtGallery();