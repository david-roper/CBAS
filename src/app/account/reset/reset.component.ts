import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthenticationService } from '../../services/authentication.service';
import { IdentityService } from '../../services/identity.service';
import { Signin } from '../signin';
import { ManageUserService } from '../../services/manageuser.service';

@Component({
    templateUrl: './reset.component.html',
    styleUrls: ['../account.scss'],

})
export class ResetComponent extends Signin {

    model: any = {};
    userID: string;
    token: string;
    showSuccess = false;
    //selectedPiSiteIds: any;
    //PISite = new UntypedFormControl();

    constructor(
        protected router: Router,
        private route: ActivatedRoute,
        protected oAuthService: OAuthService,
        protected authenticationService: AuthenticationService,
        private identityService: IdentityService,
        protected manageuserService: ManageUserService) {

        super(router, oAuthService, authenticationService, manageuserService);
        this.userID = '';
        this.token = '';

        this.route.queryParams.subscribe(params => {
            this.userID = params['userId'];
            this.token = params['code'];

        });
    }

    reset(): void {


        this.identityService.submitNewPass(this.model.username, this.token, this.model.password).subscribe(
            (res: any) => {
                // IdentityResult.
                if (res == 'Invalid Email!') {
                    this.errorMessages.push({ description: "Invalid Email!" });
                } else {
                    if (res.succeeded) {
                        this.showSuccess = true;
                    } else {
                        this.errorMessages = res.errors;
                    }
                }

            },
            () => {
                // const errMsg = (error.message) ? error.message :
                //     error.status ? `${error.status} - ${error.statusText}` : "Server error";
                //console.log(errMsg);
                this.errorMessages.push({ description: "Server error. Try later." });
            });


    }

}
