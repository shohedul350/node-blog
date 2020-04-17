const moment = require('moment')
const Flash = require('../utils/Flash');
const Post = require('../models/Post')
const Profile = require('../models/Profile')

function getDate (days){
let date = moment().subtract(days,'days')
return date.toDate()
}
function generateFilterObject(filter){
    let filterObj ={}
    let order = 1
    switch(filter){
        case 'week':{
            filterObj={
                createdAt:{
                    $gt: getDate(7)
                }
            }
            order= -1
            break
        }
        case 'month':{
            filterObj={
                createdAt:{
                    $gt: getDate(30)
                }
            }
            order= -1
            break
        }
        case 'all':{
            order= -1
            break
        }
        
    }
    return {
        filterObj,
        order
    }
}
exports.explorerGetController = async (req, res, next)=>{
    let filter = req.query.filter || 'letest'

    let currentPage = parseInt(req.query.page) || 1
    itemPerPage =10

    let {order,filterObj} = generateFilterObject(filter.toLowerCase())

try {
    let posts = await Post.find(filterObj)
        .populate('author','username')
        .sort(order == 1 ? '-createdAt' : 'createdAt')
        .skip((itemPerPage* currentPage)-itemPerPage)
        .limit(itemPerPage)

        let totalPost = await Post.countDocuments()
        let totalPage = totalPost/itemPerPage
   
        let bookmarks = []
        if(req.user){
            let profile =await Profile.findOne({user:req.user._id})
            if(profile){
                bookmarks=profile.bookmarks
            }
        }

    res.render('explorer/explorer',
    {
        tittle:'Explorer',
        filter,
        flashMessage: Flash.getMessage(req),
        posts,
        itemPerPage,
        totalPage,
        currentPage,
        bookmarks
    })
} catch (error) {
    console.log(error)
    next(error)
    
}

}



exports.singlePostGetController = async (req, res, next)=>{
    let {postId} = req.params
    try {
 let post = await Post.findById(postId)
 .populate('author','username') 
 .populate({
     path: 'comments',
     populate:{
         path:'user',
         select:'username profilePic'
     }
 })
 .populate({
     path: 'comments',
     populate:{
        path:'replies.user',
        select:'username profilePic'
    }
 })

 if(!post){
     let error = new Error('404 page not found')
     error.status = 404
     throw error
 }


 let bookmarks = []
 if(req.user){
     let profile =await Profile.findOne({user:req.user._id})
     if(profile){
         bookmarks=profile.bookmarks
     }
 }

 res.render('explorer/singlePost',
 {
     tittle: post.tittle,
     flashMessage: Flash.getMessage(req),
     post,
     bookmarks
 })
        
    } catch (error) {
        next(error)
    }
}