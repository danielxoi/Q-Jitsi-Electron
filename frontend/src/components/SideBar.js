import React, { useContext, useState } from 'react'

import TheContext from '../TheContext'
import { Divider, Header, Icon, Image, List, Menu, Sidebar } from 'semantic-ui-react'
import Search from './Search'
import { Link, useLocation } from 'react-router-dom'

import Chat from './Chat'


const Participant = ({ participant, host, yourRoom }) => {
  const { user, socket, gotoRoom, liveUsers } = useContext(TheContext)

  const style = { textAlign: "left", display: "flex", flexDirection: "row", alignItems: "center", padding: "4px" }
  return (
    <li className="participant" style={style}>
      <div className={host ? 'host' : 'not-host'}>{participant.name}</div>

      <div className="flip-container">
        <div className="flipper">
          <div className="front">
            <Image avatar src={participant.avatar} style={{ background: 'white' }} />
          </div>
          <div className="back">
            {/* <button className="remove-participant">X</button> */}
            {(yourRoom && !host.lol && (
              <button
                className="remove-participant"
                onClick={(e) => {
                  e.preventDefault(); console.log("console.lop"); socket.emit('remove', participant?.email); goToRoom(null);
                }}
              >
                X
              </button>
            )) || <button className="remove-participant">🤪</button>}
          </div>
        </div>
      </div>

      {/* {host && <span>HOST</span>} */}
    </li>
  )
}

const Room = ({ room, id }) => {
  const { gotoRoom, user } = useContext(TheContext)
  // console.log('ROOM', room, user, user.email)
  const style = {}
  const yourRoom = room?.user?.email == user?.email
  const currentRoom = room?._id === location.hash.split('/').pop()
  if (currentRoom) {
    style.backgroundColor = '#2b2b2b'
    style.textDecoration = 'underline'
    // style.fontFamily = "Futura"
    style.borderRight = '20px solid rgb(43, 43, 43)'
  }
  // let host = room.activeUsers.some(x => x.email == user.email)
  return (
    <Link key={room._id} to={{ pathname: `/chat/${room?._id}`, state: room }} >
      {/* onClick={() => gotoRoom(room.id, room)} */}

      <Menu.Item key={room._id} className="menu-item-sidebar" style={style} header>
        <Header key={room._id} as="h5" inverted>

          <span>{room?.message}</span>
          {room?.activeUsers.length !== 0 && <span className='activeUsers'>{room?.activeUsers?.length}</span>}


        {yourRoom && <button className="close-room" onClick={() => console.log('Send everyone to lobby')} >X</button>}

      </Header>

        {/* {currentRoom && !yourRoom && !room.userChannel ? ( */}
        {/* {currentRoom ? (
          <div className="controls">
            <button onClick={() => gotoRoom(room?._id, room)}>
              <Icon name="video" />

          </button>

          </div>)

          : null} */}

        {room?.activeUsers?.length !== 0 &&

      <List inverted>
          {room?.activeUsers?.length ? (
            room?.activeUsers.map((x) => {
              if (x?.email == user?.email) {
              // style.backgroundColor = '#2b2b2b'
              style.color = '#4DAA57'
              style.textDecoration = 'none'
              style.fontSize = ".875rem"
              style.cursor = 'pointer'
            }





              return <Participant participant={x} host={x?.email == user?.email} yourRoom={yourRoom} key={x?.email} gotoRoom={gotoRoom} />

          })
        ) : (
          <Header as="p" inverted>
            
            No users
          
          </Header>
        )}
      </List>

        }
    </Menu.Item>
    </Link>
  )
}

export default function SideBar({ video }) {
  const { user, activeRooms, room, gotoRoom, posts, setStyle, style, query, className, setClassName, showSlider, setShowSlider, open, setOpen } = useContext(TheContext)


  const sortedRooms = Object.values(posts)
    .filter(
      (x) =>
        ((x.message.toLowerCase().includes(query.toLowerCase())) || //&& x.active && x.activeUsers.length) ||
        x.id == 'lobby' ||
          x.isLobby) && !x.userChannel && !x.dmChannel
      // (x) => (x.active && x.activeUsers.length) || x.id == 'lobby' || x.isLobby
    ).sort((a, b) => a.active ? -1 : 1)

  const userChannels = []


  for (let channel of Object.values(posts)) {
    if (channel.userChannel && !userChannels.some(c => c._id == channel._id) && channel.message.toLowerCase().includes(query.toLowerCase())) {  //Unique user channels 
      userChannels.push(channel)
    }
  }


  const dmChannels = []

  for (let channel of Object.values(posts)) {
    console.log('love ', channel)
    // console.log("channel", channel, channel.dmChannel, !dmChannels.some(c => c._id == channel._id))
    if (channel.dmChannel && channel.members.includes(user._id) && !dmChannels.some(c => c._id == channel._id) && channel.message.toLowerCase().includes(query.toLowerCase())) {  //Unique dm channels 
      dmChannels.push(channel)
    }
  }

  // console.log(userChannels, ' bb')
  return (
    <>
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      // onHide={() => setVisible(false)}
      vertical
      className="style-3"
      visible
      style={style.sideBar}
    >
        <Search setStyle={setStyle} setClassName={setClassName} className={className} />
        {video}

        
        <div className={`${showSlider ? 'show-slider' : 'hide-slider'}`} onClick={() => setShowSlider(false)}>


          {/*ROOMS */}
          <div id="rooms" className={open === 'rooms' ? `open` : 'closed'} onClick={() => setOpen('rooms')}>
            <h5 className="panelHeader"><span className="emojis">🏡</span> {sortedRooms.length} Rooms</h5>

            <ul className="scrollathon">
            {sortedRooms.length > 0 ? (sortedRooms.map((room) => (
                <Room room={room} key={room.id} />
            ))) : <h3>No Rooms Found </h3>}
            </ul>

          </div>

          {/*DMS */}
          <div id="direct-messages" className={open === 'direct-messages' ? `open` : 'closed'} onClick={() => setOpen('direct-messages')} >
           
            <h5 className="panelHeader"> <span className="emojis ">💬</span> {dmChannels.length} Chats </h5>
            <span >
              <ul className="scrollathon">
              <Link to='/new-message'><li><Icon name="add" /> New Message 💬</li></Link>


              {dmChannels.length > 0 ? dmChannels.map((room) => <Room room={room} key={room.id} />) : <h3>No Messages Found</h3>}

            </ul>
            </span>

          </div>


          {/*USERS */}
          <div id="users" className={open === 'users' ? `open` : 'closed'} onClick={() => setOpen('users')} >
            <h5 className="panelHeader"> <span className="emojis ">🤯</span> {userChannels.length} Users </h5>
            <ul className="scrollathon">
              {userChannels.length > 0 ? userChannels.map((room) => <Room room={room} key={room.id} />) : <h3>No Users Found</h3>}
            </ul>
          </div>

        </div>

      </Sidebar>
      {/* <Chat /> */}

    </>
  )





  // function Messages() {

  //   return (

  //     <div id="direct-messages" className={open === 'direct-messages' ? `open` : 'closed'} onClick={() => setOpen('direct-messages')} >
  //       {/* <Link to='/new-message'> */}
  //       <h5 className="panelHeader"> <span className="emojis ">💬</span> {dmChannels.length} Chats </h5>

  //       {/* </Link> */}
  //       <ul>
  //         {/* <li><Icon name="add" /> New Message 💬</li> */}
  //         {dmChannels.map((room) => <Room room={room} key={room.id} />)}
  //       </ul>
  //     </div>


  //   )
  // }



  // function Users() {
  //   const { liveUsers } = useContext(TheContext)
  //   // console.log(liveUsers, ' why is this happeneing??? ')
  //   return (
  //     <div id="users" className={open === 'users' ? `open` : 'closed'} onClick={() => setOpen('users')} >
  //       <h5 className="panelHeader"> <span className="emojis ">🤯</span> {userChannels.length} Users </h5>
  //       <ul>
  //         {userChannels.map((room) => <Room room={room} key={room.id} />)}
  //       </ul>
  //     </div>

  //   )
  // }




  // function UserRoom({ email, name, createdAt, points, _id }) {
  //   // console.log(props)
  //   const { gotoRoom, user } = useContext(TheContext)
  //   // console.log('ROOM', room, user, user.email)
  //   //console.log(room, 'jurassic park')
  //   const style = {}
  //   const yourRoom = email == user?.email
  //   const currentRoom = _id === location.hash.split('/').pop()
  //   if (currentRoom) {
  //     // style.backgroundColor = '#2b2b2b'
  //     // style.textDecoration = 'underline'
  //     // // style.fontFamily = "Futura"
  //     // style.borderRight = '20px solid rgb(43, 43, 43)'
  //   }

  //   // let host = room.activeUsers.some(x => x.email == user.email)
  //   return (
  //     <Link to={`/chat/${_id}`}>
  //       {/* onClick={() => gotoRoom(room.id, room)} */}

  //       <Menu.Item className="menu-item-sidebar" style={style} header width="250px" link="#">
  //         <Header as="h5" inverted>

  //           <span>{name}</span>


  //         </Header>



  //       </Menu.Item >
  //     </Link >
  //   )
  // }

}



