const dummy=()=>{
return 1
}


const totalLikes=(blogs=>{
  return  blogs.reduce((totalLikes,currentBlog)=>{
        return totalLikes+currentBlog.likes
    },0)
})


const favoriteBlog =(blogs )=>{

    return blogs.reduce((favouriteBlog,currentBlog)=>{
         
        if(favoriteBlog.likes<currentBlog.likes){
            return currentBlog
        }
        return favouriteBlog
    })
}

export {dummy, totalLikes,favoriteBlog}