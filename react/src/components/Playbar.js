import { Button, Icon, IconButton } from '@material-ui/core';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import Stop from '@material-ui/icons/Stop';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import FastRewind from '@material-ui/icons/FastRewind';

import React from 'react'
// import { useMediaQuery } from 'react-responsive'
import '../App.css';
// import { useEffect, useState } from 'react'

export default function PlayBar(props){
    
    return(
        <div className="App-Playbar" style={{width:"30%"}}>
            <IconButton disabled={props.recordingState} onClick={props.onClickPlay} className="material-icons play-button">
                <PlayArrow style={{width: '4vw', height: '4vw', fill: 'white'}}/>
            </IconButton>
            <IconButton disabled={props.recordingState} onClick={props.onClickPause} className="material-icons play-button">
                <Pause style={{width: '4vw', height: '4vw', fill: 'white'}}/>
            </IconButton>
            <IconButton disabled={props.recordingState} onClick={props.onClickStop} className="material-icons play-button">
                <Stop style={{width: '4vw', height: '4vw', fill: 'white'}}/>
            </IconButton>
            <IconButton disabled={props.recordingState} onClick={props.onClickRewind} className="material-icons play-button">
                <FastRewind style={{width: '4vw', height: '4vw', fill: 'white'}}/>
            </IconButton>
            <IconButton onClick={props.onClickRecord} className="material-icons play-button">
                <FiberManualRecord style={{width: '4vw', height: '4vw', fill: props.recordingState ? '#c4302b': '#E37B7B'}}/>
            </IconButton>
            {/* <button disabled={props.recordingState} onClick={props.onClickPlay} className="material-icons play-button">play_arrow</button>
            <button disabled={props.recordingState} onClick={props.onClickPause} className="material-icons play-button" >pause</button>
            <button disabled={props.recordingState} onClick={props.onClickStop} className="material-icons play-button">stop</button>
            {!props.recordingState && <button onClick={props.onClickRecord} className="material-icons red play-button">fiber_manual_record</button>}
            {props.recordingState && <button onClick={props.onClickRecordStop} className="material-icons redder play-button">fiber_manual_record</button>} */}
        </div>
    );

}
