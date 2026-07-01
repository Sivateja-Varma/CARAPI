import {useState} from "react";

export default function CodeBlock({children}){

const [copied,setCopied]=useState(false)

const copy=()=>{

navigator.clipboard.writeText(children)

setCopied(true)

setTimeout(()=>{

setCopied(false)

},1500)

}

return(

<div
style={{
background:"#1f2937",
padding:"20px",
borderRadius:"10px",
marginBottom:"20px",
position:"relative",
color:"white",
fontFamily:"monospace"
}}
>

<button
onClick={copy}
style={{
position:"absolute",
right:"10px",
top:"10px"
}}
>

{copied?"Copied":"Copy"}

</button>

<pre>

{children}

</pre>

</div>

)

}