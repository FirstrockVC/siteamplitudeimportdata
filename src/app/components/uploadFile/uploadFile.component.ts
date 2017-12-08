import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import  { UploadFileService} from './uploadFile.service';
import * as csv from "csvtojson"
import * as _ from 'lodash';
import swal from 'sweetalert2';

@Component({
  selector: 'upload-file',
  providers: [ UploadFileService ],
	templateUrl: './uploadFile.template.html'
})

export class UploadFileComponent {

  public file = null;
  public data = null;
  public submitted = false;
	public uploadForm: FormGroup;

  constructor(private uploadFileService: UploadFileService) { }

  public ngOnInit() {
		this.uploadForm = new FormGroup({
			key: new FormControl('', Validators.required)
		});
	}

  public onFileChange(event) {
    this.file = event.target.files[0];
  }

  public onValidate(isValid){
    this.submitted = true;
    if (isValid && (this.data !== '' && this.file !== null)){
      const events= [];
      let reader = new FileReader();
      reader.readAsText(this.file);
      reader.onload = () => {
        let text = reader.result;
        var options = {
          headers : "hola, juan, serna"
        };
        csv({
          noheader: false,
          headers: ['event_type','user_id','time']
        }).fromString(text, options).on('json',(json)=>{
          events.push(json);
          }).on('done',()=>{
            const promises = [];
            for(let i = 0; i< events.length; i = i + 1000) {
              promises.push(this.uploadFile(events, i , + i + 1000));
            }
            Promise.all(promises).then(values => {
              this.resetFile();
              this.uploadForm.reset();
              swal({
                title: 'Success',
                text: 'The data was imported correctly',
                type: 'success'
              });
            }).catch(e => {
              swal({
                title: 'Error!',
                text: 'An error occurs when importing the data',
                type: 'error'
              });
            });
        });
        }
    };
  }

  public resetFile(){
    this.file = null;
    this.data = '';
    this.submitted = false;
  }

  public uploadFile = (events, lower, upper) => {
    return this.uploadFileService.uploadAmplitudeData(_.slice(events, lower,upper), this.uploadForm.controls['key'].value);
  }
}
