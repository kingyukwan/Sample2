import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators,ReactiveFormsModule} from "@angular/forms";
import { FileUploadService } from '../fileupload.service';
import {
  Ng4FilesStatus,
  Ng4FilesSelected,
  Ng4FilesService,
  Ng4FilesConfig
} from 'angular4-files-upload';
// import{ FileUploader } from 'angular-file-upload';
@Component({
  selector: 'base64-upload',
  templateUrl: './base64-upload.component.html'
})
export class Base64UploadComponent {
  form: FormGroup;
  loading: boolean = false;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private fb: FormBuilder,
            private fileuploadservice: FileUploadService,
            private ng4FilesService: Ng4FilesService,
            // private fileUploader: FileUploader
          ) {
    this.createForm();
    // new fileUploader({url:""})
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      avatar: null
    });
  }

//   onFileChange(event) {
//     let reader = new FileReader();
//     if(event.target.files && event.target.files.length > 0) {
//       let file = event.target.files[0];
//       reader.readAsDataURL(file);
//       reader.onload = () => {
//         this.form.get('avatar').setValue({
//           filename: file.name,
//           filetype: file.type,
//           value: reader.result.split(',')[1]
//         })
//       };
//     }
//   }
onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.form.get('avatar').setValue(file);
    }
  }
  private prepareSave(): any {
    let input = new FormData();
    // This can be done a lot prettier; for example automatically assigning values by looping through `this.form.controls`, but we'll keep it as simple as possible here
    input.append('name', this.form.get('name').value);
    input.append('avatar', this.form.get('avatar').value);
    return input;
  }
  onSubmit() {
    // const formModel = this.form.value;
    const formModel = this.prepareSave();
    this.loading = true;
    // In a real-world app you'd have a http request / service call here like
    // this.http.post('apiUrl', formModel)
    // setTimeout(() => {
    //   console.log(formModel);
    //   alert('done!');
    //   this.loading = false;
    // }, 1000);
    this.fileuploadservice.uploadFile(formModel);
  }

  clearFile() {
    this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

  
public selectedFiles;
public item: File;
public filesSelect(selectedFiles: Ng4FilesSelected): void {
    if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) {
      this.selectedFiles = 'invalid file !!';
      // this.selectedFiles = selectedFiles.status;
      return;
      
      // Hnadle error statuses here
    }

    if(selectedFiles.files.length > 0) {
      let file = selectedFiles.files[0];
      this.form.get('avatar').setValue(file);
    }
    this.selectedFiles = Array.from(selectedFiles.files).map(file => file.name);
  }

  private testConfig: Ng4FilesConfig = {
    acceptExtensions: ['xls', 'xlsx'],
    maxFilesCount: 1,
    maxFileSize: 5120000,
    totalFilesSize: 10120000
  };

  ngOnInit() {
    this.ng4FilesService.addConfig(this.testConfig);
  }
}