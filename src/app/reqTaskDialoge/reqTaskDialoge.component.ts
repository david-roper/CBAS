import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { Request } from '../models/request';
import { RequestService } from '../services/request.service';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FIELDISREQUIRED, INVALIDEMAILADDRESS } from '../shared/messages';



@Component({

    selector: 'app-req-task-dialoge',
    templateUrl: './reqTaskDialoge.component.html',
    styleUrls: ['./reqTaskDialoge.component.scss'],
    providers: [RequestService]

})
export class ReqTaskDialogeComponent {

    faQuestionCircle = faQuestionCircle;
    // Defining Models Parameters

    reqScheduleModel: string;
           
    private _request: Request;

    // UntypedFormControl Parameters

    name: UntypedFormControl;
    task: UntypedFormControl;
    email: UntypedFormControl;
    

    constructor(public thisDialogRef: MatDialogRef<ReqTaskDialogeComponent>,
         
        private requestService: RequestService,
        private fb: UntypedFormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.reqScheduleModel = '';
        this.name = fb.control('', [Validators.required]);
        this.task = fb.control('', [Validators.required]);
        this.email = fb.control('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]);
        this._request = {
            age: '', controlSuggestion: '', doi: '', email: '', fullName: '', generalRequest: '', geneticModification: '', genotype: '', ID: 0,
            method: '', model: '', mouseStrain: '', piEmail: '', piFullName: '', piInstitution: '', scheduleName: '', strainReference: '', subMethod: '',
            subModel: '', taskCategory: '', taskName: '', type: ''
        }
    }

    onCloseCancel(): void {


        this.thisDialogRef.close('Cancel');

    }

    onCloseSubmit(): void {

        // building request object
        this._request.fullName = this.name.value;
        this._request.email = this.email.value;
        this._request.taskName = this.task.value;
        this._request.scheduleName = this.reqScheduleModel;

        // Submiting the request to server
        this.requestService.addTask(this._request).subscribe( this.thisDialogRef.close() );
       
    }


    getErrorMessage()
    {

        return this.name.hasError('required') ? FIELDISREQUIRED :
            '';
    }

    getErrorMessageTask() {

        return this.task.hasError('required') ? FIELDISREQUIRED :
            '';
    }

    getErrorMessageEmail()
    {

        return this.email.hasError('required') ? FIELDISREQUIRED :
            '';

    }


    getErrorMessageEmailValid()
    {

        return this.email.hasError('pattern') ? INVALIDEMAILADDRESS :
            '';
    }

   
    setDisabledVal()
    {

        if (this.name.hasError('required') ||
            this.email.hasError('required') ||
            this.email.hasError('pattern') ||
            this.task.hasError('required')
            
        )
        {
            return true;
        }

        return false;
    }

        
}
