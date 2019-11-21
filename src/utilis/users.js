const users=[]

//tracking-adduser,removeuser,getuser,getuserinroom
//use tracking room of user
//integrate index.js
const addUser=({id,username,room})=>{
  //clean the data
  username=username.trim().toLowerCase()
  room=room.trim().toLowerCase()

  //Validate the data
  if(!username || !room){
    return{
      error:'Username and room are required'
    }
  }

  //check existing User
  const existingUser=users.find((user)=>{
       return user.room === room && user.username === username
  })

  if(existingUser){
    return {
      error:'Username is use'
    }
  }

  //storeUser
  const user={id,username,room}
  users.push(user)
  return {user}
}

//removeUser

const removeUser=((id)=>{
  //like find method
   const index=users.findIndex((user)=> user.id ===id) //(-1 not find) (0 findit)
  
   if(index !==-1 ){
       return users.splice(index,1)[0] //return array and access first object
   }
})
 //gwtuser by id
const getUser=(id)=>{
  return users.find((user)=> user.id===id)
}
//get user by room
const getUserInRoom=(room)=>{
  room=room.trim().toLowerCase()
  return users.filter((user)=> user.room===room )
}


module.exports={
  addUser,
  removeUser,
  getUser,
  getUserInRoom
}


