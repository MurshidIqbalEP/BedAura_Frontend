
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useNavigate, useParams } from 'react-router-dom';

function randomID(len: number) {
  let result = '';
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  const maxPos = chars.length;
  len = len || 5;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}



const appId = parseInt(import.meta.env.VITE_ZEGOCLOUDE_APPID);
const Secret = import.meta.env.VITE_ZEGOCLOUDE_SERVERSECRET;

export default function Videocall() {

    let {roomId} =useParams()
  const roomID = roomId as string
  const navigate = useNavigate();

  let myMeeting = async (element:any) => {
    
     // generate Kit Token
      const appID = appId;
      const serverSecret = Secret.toString();
      const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId as string,  randomID(5), randomID(5));
      console.log(kitToken);
      
     // Create instance object from Kit Token.
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      
      // start the call
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Copy link',
            url:
             window.location.protocol + '//' + 
             window.location.host + window.location.pathname +
              '?roomID=' +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
        onLeaveRoom: () => {
          navigate('/'); // Redirect to home page
        },
      });
    }

  return (
    <div
      className="myCallContainer h-screen"
      ref={myMeeting}
      
    ></div>
  );
}
