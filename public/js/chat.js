const socket=io()

//Elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput= $messageForm.querySelector('input')
const $messageFormButton= $messageForm.querySelector('button')
const $messagelocation=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')
// const $locations=document.querySelector('#locations')

//template
const $messageTemplate=document.querySelector('#message-template').innerHTML
const $locationTemplate=document.querySelector('#location-template').innerHTML
const $sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//options
const { username, room} =Qs.parse(location.search,{ ignoreQueryPrefix:true })

const autoscroll =()=>{

    //newmessage element
    const $newMessage= $messages.lastElementChild

    //height of the new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight=$messages.offsetHeight

    //height of messages container
    const containerHeight=$messages.scrollHeight

    //how far i scrolled?
    const scrolloffset=$messages.scrollTop+visibleHeight

    if(containerHeight-newMessageHeight <= scrolloffset){   
      $messages.scrollTop=$messages.scrollHeight
    }
}

socket.on('message',(message)=>{
      console.log(message)
      const html = Mustache.render($messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
      })
      $messages.insertAdjacentHTML('beforeend',html)
      autoscroll()
})

socket.on('locationMessage',(message)=>{
  console.log(message)
  const html= Mustache.render($locationTemplate,{

    username:message.username,
    url:message.url,
    createdAt:moment(message.createdAt).format('h:mm a ')})

  $messages.insertAdjacentHTML('beforeend',html)
  autoscroll()
})

socket.on('roomData',({room,users})=>{
  const html=Mustache.render($sidebarTemplate,{
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML=html
})
$messageForm.addEventListener('submit',(e)=>{
  e.preventDefault()

  //disabled button
  $messageFormButton.setAttribute('disabled','disabled')

  const message= e.target.elements.message.value
  
  socket.emit('sendMessage',message,(error)=>{

    //enable button
    $messageFormButton.removeAttribute('disabled')
    //clr input box
    $messageFormInput.value=''
    //cursor
    $messageFormInput.focus()

    if(error){
        return console.log(error)
    }
    console.log('Message has a delivered',)
  })

})

$messagelocation.addEventListener('click',()=>{

  if(!navigator.geolocation){
    return alert('Geolocation not supported You are browser')
  }

  $messagelocation.setAttribute('disabled','disabled')

  navigator.geolocation.getCurrentPosition((position)=>{

    socket.emit('send-location',{
       latitude  : position.coords.latitude,
       longtitude: position.coords.longitude
    },()=>{
      $messagelocation.removeAttribute('disabled')//disabled
      console.log('location delivered!')
    } )
  })
})

socket.emit('join',{ username ,room},(error)=>{
 
  if(error){
    alert(error)
    location.href='/'
  }
})

