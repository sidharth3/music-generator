const bpm = 120 
export default class Recorder
{
    constructor() {
        this.bpm = bpm;
        this.timeSlice = 1/(this.bpm*4/60); //time slice - time of 16th notes
        this.windowLength = 20; //number of time slices
        this.slices = [];
        this.currentChord = null;

        //callbacks 
        this.onFinishRecording = null;
    }

    reset() {
        this.slices = [];
        this.currentChord = null;
    }
    
    onChordPressed(chord) {
        this.currentChord = chord;
    }

    onChordReleased(chord) {
        if(this.currentChord == chord) {
            this.currentChord = null;
        }
    }

    startRecording() {
        console.log('started recording!')
        this.recording = true;

        //start slice tracking clock
        this.interval = setInterval(() => {
            this.captureSlice();    
        }, this.timeSlice * 1000);
    }

    stopRecording() {
        this.recording = false;

        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    finishRecording() {
        this.stopRecording();

        if(this.onFinishRecording) {
            let result = this.slices;
            //convert slices to parsable midi combination tuples

            let tuples = []
            for(let slice of result) {
                //rest
                if(!slice) {
                    tuples.push([])
                    continue;
                }

                let tuple = []
                for(let note of slice.array) {
                    let midi = noteStringToMidi(note)
                    tuple.push(midi)
                }

                tuples.push(tuple)
            }

            this.onFinishRecording(tuples);
        }
    }

    captureSlice() {
        if(!this.recording) {
            return;
        }

        if(this.slices.length > this.windowLength) {
            this.finishRecording();
        }

        // console.log('recording slice: ', this.currentChord)
        this.slices.push(this.currentChord);
    }

    getVisualNotes() {
        let output = []
        this.slices.forEach((slice, i) => {
            if(!slice) {
                return;
            }
            slice.array.forEach(noteString => {
                let midi = noteStringToMidi(noteString); //C6 => 60 
                output.push({
                    time: i*this.timeSlice,
                    duration: this.timeSlice,
                    midi,
                    user: true
                })
            });
        })

        return output;
    }
}

const noteToScaleIndex = {
	cbb: -2, cb: -1, c: 0, "c#": 1, cx: 2,
	dbb: 0, db: 1, d: 2, "d#": 3, dx: 4,
	ebb: 2, eb: 3, e: 4, "e#": 5, ex: 6,
	fbb: 3, fb: 4, f: 5, "f#": 6, fx: 7,
	gbb: 5, gb: 6, g: 7, "g#": 8, gx: 9,
	abb: 7, ab: 8, a: 9, "a#": 10, ax: 11,
	bbb: 9, bb: 10, b: 11, "b#": 12, bx: 13,
};

const noteStringToMidi = (noteString) => {
    let components = noteString.match(/^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i)
    let pitch = components[1]
    let octave = components[2]
    const index = noteToScaleIndex[pitch.toLowerCase()];
    const noteNumber = index + (parseInt(octave, 10) + 1) * 12;
    return noteNumber;
}