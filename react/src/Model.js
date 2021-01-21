import { Midi } from '@tonejs/midi';
import axios from 'axios';
import fileDownload from 'js-file-download'

const server = 'http://localhost:5000'

export default class Model {

    constructor() {
        this.lastTokenSequence = []
        this.fullTokenSequence = []
    }

    async userInputToMidi(userInput) {
        let token_sequence = await this.userCombiToTokenSequence(userInput);
        this.lastTokenSequence = token_sequence;
        this.fullTokenSequence = token_sequence;
        let userInputMidi = await this.tokenSequenceToMidi(token_sequence);        
        return userInputMidi;
    }

    async generateNext() {
        let sliceOffsetCount = this.fullTokenSequence.length; //the slice count before it was generated
        let generatedTokenSequence = await this.generateNextTokenSequence();
        let generatedMidi = await this.tokenSequenceToMidi(generatedTokenSequence);
        return {
            midi: generatedMidi,
            tokens: generatedTokenSequence,
            slicesBeforeGenerated: sliceOffsetCount
        };
    }

    async generateNextTokenSequence() {
        if(this.lastTokenSequence.length == 0) {
            console.error('Last token sequence missing. Please record first')
        }

        let window = 300
        let refTokenSequence = this.fullTokenSequence.length >= window ? this.fullTokenSequence.slice(this.fullTokenSequence.length-window) : this.fullTokenSequence; //if the full length is too short, just send the short one and let server side pad
        let generatedTokenSequence = await this.generateTokenSequenceFromTokenSequence(refTokenSequence)
        this.fullTokenSequence = [...this.fullTokenSequence, ...generatedTokenSequence]; //append token sequence
        this.lastTokenSequence = generatedTokenSequence;
        return generatedTokenSequence;
    }
    
    async userCombiToTokenSequence(user_combi) {
        // let url = server + '/generate_from_user_input'
        let response = await axios({            
            url: server + '/user_combi_to_token_sequence',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            responseType: 'json',
            data: { user_combi }
        })
        
        if(response.status == 200 && response.data) {
            let token_sequence = response.data
            return token_sequence
        }

        console.error('userCombiToTokenSequence: invalid response from server');
        return null;
    }
    
    async tokenSequenceToMidi(token_sequence) {
        let response = await axios({            
            url: server + '/token_sequence_to_midi',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            responseType: 'arraybuffer',
            data: { token_sequence }
        })

        if(response.status == 200 && response.data) {
            let midiFile = new Midi(response.data)
            this.lastMidiChunk = midiFile;
            return midiFile;
        }

        console.error('tokenSequenceToMidi: invalid response from server');
        return null;
    }

    async generateTokenSequenceFromTokenSequence(last_token_sequence) {
        
        let response = await axios({            
            url: server + '/generate_next_token_sequence',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            responseType: 'json',
            data: { token_sequence: last_token_sequence }
        })

        if(response.status == 200 && response.data) {
            let token_sequence = response.data;
            return token_sequence;
        }

        console.error('tokenSequenceToGeneratedTokenSequence: invalid response from server');
        return null;
    }

    reset() {
        this.lastTokenSequence = []
        this.fullTokenSequence = []
    }
}