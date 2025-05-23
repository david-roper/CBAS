import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { Request } from '../models/request';
import { RequestService } from '../services/request.service';
import { FIELDISREQUIRED, INVALIDEMAILADDRESS } from '../shared/messages';



@Component({

    selector: 'app-reqpi-dialoge',
    templateUrl: './reqPIDialoge.component.html',
    styleUrls: ['./reqPIDialoge.component.scss'],
    providers: [RequestService]

})
export class ReqPIDialogeComponent {

           
    private _request: Request;

    // UntypedFormControl Parameters

    name: UntypedFormControl;
    email: UntypedFormControl;
    emailPI: UntypedFormControl;
    piName: UntypedFormControl;
    institution: UntypedFormControl;

    constructor(public thisDialogRef: MatDialogRef<ReqPIDialogeComponent>,
         
        private requestService: RequestService,
        private fb: UntypedFormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.name = fb.control('', [Validators.required]);
        this.email = fb.control('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]);
        this.emailPI = fb.control('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]);
        this.piName = fb.control('', [Validators.required]);
        this.institution = fb.control('', [Validators.required]);
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
        this._request.piFullName = this.piName.value;
        this._request.piEmail = this.emailPI.value;
        this._request.piInstitution = this.institution.value;
        

        // Submiting the request to server
        this.requestService.addPI(this._request).subscribe( this.thisDialogRef.close()); 
       
    }


    getErrorMessage()
    {

        return this.name.hasError('required') ? FIELDISREQUIRED :
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

    getErrorMessagePIName() {
        return this.piName.hasError('required') ? FIELDISREQUIRED :
            '';
    }

    getErrorMessageIns() {
        return this.institution.hasError('required') ? FIELDISREQUIRED :
            '';
    }

    getErrorMessagePIEmail() {

        return this.emailPI.hasError('required') ? FIELDISREQUIRED :
            '';

    }

    getErrorMessagePIEmailValid() {

        return this.emailPI.hasError('pattern') ? INVALIDEMAILADDRESS :
            '';
    }



   
    setDisabledVal()
    {

        if (this.name.hasError('required') ||
            this.email.hasError('required') ||
            this.email.hasError('pattern') ||
            this.emailPI.hasError('required') ||
            this.emailPI.hasError('pattern') ||
            this.piName.hasError('required') ||
            this.institution.hasError('required')
            
        )
        {
            return true;
        }

        return false;
    }

        
}
