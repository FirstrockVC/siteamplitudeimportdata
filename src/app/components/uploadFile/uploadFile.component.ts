import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import  { UploadFileService} from './uploadFile.service';
import * as csv from "csvtojson"
import * as _ from 'lodash';
import * as moment from 'moment';
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
        csv({
          noheader: false,
          headers: ['event_type','user_id','time']
        })
        .fromString(text)
        .transf((json,csvRow)=> {
          if (!this.validateTime(csvRow[0]) && !this.validateTime(csvRow[1]) &&
            this.validateTime(csvRow[2])){
            json.time = moment(json.time).unix();
            events.push(json);
          }else{
            swal({
              title: 'Error!',
              html:'Wrong file format, please download the example file <a href="/assets/example.csv" target="_blank">File</a>!!',
              type: 'error'
            });
          }
        })
        .on('done',(error)=>{
            if (events.length > 0){
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
            }
        })
      }
    };
  }

  public validateTime(data){
    let isnum = /^\d+$/.test(data);
    return moment(isnum ? Number(data) : data).isValid() && data.length >= 10;
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
