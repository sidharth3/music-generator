import json
from flask import Flask, request, Response
import flask
from flask_cors import CORS, cross_origin
from model import Model
import numpy as np
import helpers

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app = Flask(__name__)

# ======================================== 
#           MODEL INITIALIZATION
# ========================================
model = Model()
chunk_duration = 300 #300 slices per chunk. user input must be 300, generated will be 300
bpm = 120

@app.route('/user_combi_to_token_sequence', methods=['POST'])
@cross_origin()
def user_combi_to_token_sequence():
    raw_combi_sequence = request.json['user_combi']
    combi_sequence = [tuple(combi) for combi in raw_combi_sequence]
    token_sequence = helpers.combiSequenceToTokenSequence(combi_sequence, model.combi_to_int)    
    return Response(json.dumps(token_sequence),  mimetype='application/json')
    # return token_sequence

@app.route('/token_sequence_to_midi', methods=['POST'])
@cross_origin()
def token_sequence_to_midi():
    token_sequence = request.json['token_sequence']
    pretty_midi_file = helpers.tokenSequenceToMidi(token_sequence, model.int_to_combi, bpm)
    midiBytesIO = helpers.prettyMidiToBytesIO(pretty_midi_file)
    midiBytesIO.seek(0)
    return flask.send_file(midiBytesIO, as_attachment=True, attachment_filename='token_sequence_to_midi.mid')
    

@app.route('/generate_next_token_sequence', methods=['POST'])
@cross_origin()
def generate_next_token_sequence():
    token_sequence = request.json['token_sequence']
    print(f'received last {len(token_sequence)} tokens')
    generated_token_sequence = model.generateTokenSequenceFromTokenSequence(token_sequence, 40)
    return Response(json.dumps(generated_token_sequence),  mimetype='application/json')
    # return generated_token_sequence


if __name__ == '__main__':
    app.run()
