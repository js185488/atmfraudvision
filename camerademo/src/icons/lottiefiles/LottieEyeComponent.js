import Lottie from "react-lottie";
import eye from "./eye";
import React from "react";


export const LottieEyeComponent =({setDemo}) => {
    return(
        <div style={{display:'flex'}}>
            <Lottie
                options={{animationData: eye,
                    loop:true, autoplay:true}}
                speed={1}
                height={50}
                width={50}
                style={{marginRight:-23, margin:0}}
            />
            <Lottie
                options={{animationData: eye,
                    loop:true, autoplay:true}}
                style={{margin:0}}

                speed={1}
                height={50}
                width={50}
            />
            <p > Looking For Face </p>
        </div>
    )
};
export default LottieEyeComponent;
