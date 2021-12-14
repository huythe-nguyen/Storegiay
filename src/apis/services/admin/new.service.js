const httpStatus = require('http-status')

const ApiError = require('../../../utils/api-error')
const { New } = require('../../models')

/**
 * Create a new
 * *@param {string} id
 * @param {Object} newBody
 * @returns {Promise<New>}
 */
const createNew = async (newBody) => {
    if (await New.isCodeTaken(newBody.codeTitle)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'News already taken')
    }
    return New.create(newBody)
}
const view = async (page,size) => {
    if(page){
        pages = parseInt(page);
        if(pages<1)
            pages = 1;

        sizes = parseInt(size);
        if(sizes<5)
            sizes = 5;
        var skips = (pages-1)*sizes;
        const listNew = await New.find({state: ["cho","dang","kt"]}).skip(skips).limit(sizes)
        return listNew
    }else{
        sizes = parseInt(size);
        if(sizes<5)
            sizes = 5;
        const listNew = await New.find({state: ["cho","dang","kt"]}).limit(sizes)
        return listNew
    }
}
const search = async (key) => {
    const listsearch = await New.find({$text: {$search: key}});
    if (listsearch==0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No News')
    }
    return listsearch
}
const updateNew = async (id,newBody) => {
    const news = await New.findById(id);
    if (!news) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No news existed')
    }
    return news.update(newBody)
}
const deleteNew = async (id) => {
    const news = await New.findById(id);
    if (!news) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No news existed')
    }
    return news.remove(newBody)
}


module.exports = {
    createNew,
    updateNew,
    deleteNew,
    view,
    search
}
