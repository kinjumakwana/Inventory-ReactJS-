import {useEffect,useRef,useState} from 'react'
import axios from '../../api/axios';


const PWD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,24}$/;
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const REGISTER_URL = '/api/register';

const register = () => {

    const [user,setUser] = useState('');
    const [validName,setValidName] = useState(false);
    const [userFocus,setUserFocus] = useState(false);
    
    const [pwd,setPwd] = useState('');
    const [validPwd,setValidPwd] = useState(false);
    const [pwdFocus,setPwdFocus] = useState(false);

    const [matchPwd,setMatchPwd] = useState('');
    const [validMatch,setValidMatch] = useState(false);
    const [matchFocus,setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [succes, setSuccess] = useState(false);

    useEffect(()=>{
        userRef.current.focus();
    }, []);

    useEffect(()=>{
        const result = USER_REGEX.test(user);
        //console.log(user);
        //console.log(result);
        setValidName(result);

    },[user]);

    useEffect(()=>{
        const result = PWD_REGEX.test(pwd);
        //console.log(pwd);
        //console.log(result);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    },[pwd,matchPwd]);

    useEffect(()=>{
        setErrMsg('');
    },[user,pwd,matchPwd]);

    const handleSubmit =  async (e)=>{
        e.preventDefault();
        //rechecking of fields in case someone tries to inject values via dev tools and button is enabled via js hack

        const chkUserVal = USER_REGEX.test(user);
        const chkPwdVal = PWD_REGEX.test(pwd);
        if(!chkUserVal || !chkPwdVal){
            setErrMsg("Invalid Entry");
            return;
        }
        try{
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({username:user,password:pwd}),
                {
                    headers:{"Content-Type":"application/json"},
                    withCredentials:true
                }
                );

                //console.log(response.data);
                //console.log(response.accessToken);
                //console.log(JSON.stringify(response));
                setSuccess(true);
                //clear input fields in register page
        }
        catch(err)
        {
            if(!err?.response)
            {
                setErrMsg('No Response from Server');
            }
            else if (err.response?.status === 409){
                setErrMsg('User already exists!!');
            }
            else{
                setErrMsg('Registration failed');
            }
            errRef.current.focus();
            console.log(err);
        }
    }



  return (
    <>
    {succes?(
        <section>
            <h1>Success!</h1>
            <p>
                <a href='#'>Sign In</a>
            </p>

        </section>
         
    ):(
        <section>
        <p ref={errRef} className={errMsg?"errmsg":"offscreen"} aria-live='assertive'>{errMsg}</p>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor='username'> Username * :</label>
            <input
            type='text'
            id='username'
            ref={userRef}
            autoComplete='off'
            onChange={(e) => setUser(e.target.value)}
            required
            aria-invalid={validName?'false':'true'}
            aria-describedby='uidnote'
            onFocus={()=>setUserFocus(true)}
            onBlur={()=>setUserFocus(false)}
            />
            <p id='uidnote' className={user && userFocus && !validName ? "instructions" : "offscreen"}>
                4 to 24 characters.<br/>
                Must begin with a letter.<br/>
                Letters, numbers, underscores, hypens allowed.
            </p>


            /* password */


            <label htmlFor='password'> Password * :</label>
            <input
            type='password'
            id='password'            
            onChange={(e) => setPwd(e.target.value)}
            required
            aria-invalid={validPwd?'false':'true'}
            aria-describedby='uidpwd'
            onFocus={()=>setPwdFocus(true)}
            onBlur={()=>setPwdFocus(false)}
            />
            <p id='uidpwd' className={pwd && pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                8 to 24 characters.<br/>
                Must begin with a letter.<br/>
                Letters, numbers, underscores, hypens allowed.
            </p>


            <label htmlFor='confirm_pwd'> Confirm Password * :</label>
            <input
            type='password'
            id='confirm_pwd'            
            onChange={(e) => setMatchPwd(e.target.value)}
            required
            aria-invalid={validMatch?'false':'true'}
            aria-describedby='confirmnote'
            onFocus={()=>setMatchFocus(true)}
            onBlur={()=>setMatchFocus(false)}
            />
            <p id='confirmnote' className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                Must match the first password input field.
            </p>

            <button disabled={ !validName || !validPwd || !validMatch ? true:false}>Sign up</button>

        </form>
        <p>
            Already Registered?<br/>
            <span className='line'>
                {/* put router link here */}
                <a href='#'>Sign In</a>
            </span>
        </p>
        
    </section>        
    )}
    
    </>
    
  )
}

export default register