module.exports = {
    "port": Number(process.env.PORT || "3000"),
    "database": "mongodb://171.31.41.173:27017/xwing-miniatures-rest-api",
    "secretKey": "12345-67890-09876-54321",
    "security": {
        "tokenLife": 3600
    }
};
