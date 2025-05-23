import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { PISiteService } from '../services/piSite.service';
import { ProfileService } from '../services/profile.service';
import { IdentityService } from '../services/identity.service';
import { User } from '../models/user';
import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';
import { FIELDISREQUIRED, INVALIDEMAILADDRESS, SERVERERROR } from '../shared/messages';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    //HTML Models Parameters
    email: string;
    
    selectePISiteModel: any


    // Parameters Initialization
    model: any = {};
    showSuccess = false;
    errorMessages: any[] = [];

    userInfo: any;
    piSiteList: any;
    piSiteListByUserID: any;
    piSiteListByUserIDFilter: any


    // FormControls Definition
    givenName: UntypedFormControl;
    familyName: UntypedFormControl;


    //model Variable
    _user: User;

    constructor(private piSiteService: PISiteService,
        private identityService: IdentityService,
        private profileService: ProfileService,
        private location: Location,
        public dialog: MatDialog,
        private fb: UntypedFormBuilder) {

        this.email = '';
        this.givenName = fb.control('',[Validators.required])
        this.familyName = fb.control('', [Validators.required])
        this._user = { Email: '', familyName: '', givenName: '', roles: [], selectedPiSiteIds: [], termsConfirmed: false, userName: '' }
    }

    ngOnInit() {

        this.GetUserInfo();
        this.GetPISiteList();



        // initiilzie the values of ngModels used in User profile forms:

    }


    // Get the list of all PISite exist in DB
    GetPISiteList() {

        this.piSiteService.getPISite().subscribe(data => {
            this.piSiteList = data;
            console.log(this.piSiteList);
            this.GetPISiteListByUserID();
        });

    }

    // Get List of all PiSite by the user ID
    GetPISiteListByUserID() {

        this.piSiteService.getPISitebyUserID().subscribe((data : any) => {
            this.piSiteListByUserID = data;
            console.log(this.piSiteListByUserID);

            this.GetFilteredPiSiteList();
        });
    }

    // Filter PiSiteLsit to get the list of PIS not already added to user profile's PiSite
    GetFilteredPiSiteList() {


        var a = this.piSiteList;
        var b = this.piSiteListByUserID;

        function comparer(otherArray : any) {
            return function (current : any) {
                return otherArray.filter(function (other : any) {
                    return other.psid == current.psid
                }).length == 0;
            }
        }

        var onlyInA = a.filter(comparer(b));
        //var onlyInB = b.filter(comparer(a));

        this.piSiteListByUserIDFilter = onlyInA;

        console.log(this.piSiteListByUserIDFilter);

    }

    // Get User Info
    GetUserInfo() {

        this.profileService.getUserInfo().subscribe((data : any) => {



            this.userInfo = data;
            console.log(this.userInfo);

            this.givenName.setValue(this.userInfo.givenName);
            this.familyName.setValue(this.userInfo.familyName);
            this.email = this.userInfo.email;


        });

    }


    getErrorMessageGN() {

        return this.givenName.hasError('required') ? FIELDISREQUIRED :
            '';
    }

    getErrorMessageFN() {

        return this.familyName.hasError('required') ? FIELDISREQUIRED :
            '';
    }

    //getErrorMessagePI() {


    //    return this.piSite.hasError('required') ? 'You must enter a value' :
    //        '';

    //}

    setDisabledVal() {

        if (this.givenName.hasError('required') ||
            this.familyName.hasError('required')
            //this.piSite.hasError('required')

        ) {
            return true;
        }
        return false;
    }

    // Function Definition for changing the password (Move to Change PAssword Dialog)
    changePassword(): void {

        //this.identityService.changePassword(this.model.currentPassword, this.model.newPassword);

        this.identityService.changePassword(this.model.currentPassword, this.model.newPassword).subscribe(
            (res: any) => {
                // IdentityResult.
                if (res == 'Invalid Email!') {
                    this.errorMessages.push({ description: INVALIDEMAILADDRESS });
                } else {
                    if (res.succeeded) {
                        this.showSuccess = true;
                    } else {
                        this.errorMessages = res.errors;
                    }
                }

            },
            (error: any) => {
                const errMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : "Server error";
                console.log(errMsg);
                this.errorMessages.push({ description: SERVERERROR });
            });


    }

    clearMessages(): void {
        this.errorMessages = [];
    }

    // Function definition for Updating User Profile
    updateUserProfile(): void {

        
        this._user.givenName = this.givenName.value;
        this._user.familyName = this.familyName.value;
        this._user.selectedPiSiteIds = this.selectePISiteModel;
        //console.log(this._user);
        this.profileService.updateProfile(this._user).pipe(map((_res : any) => {

            //location.reload();
            this.GetUserInfo();
            this.GetPISiteList();
            this.selectePISiteModel = [];
            

        })).subscribe();

    }

    // Function Definition to open a dialog for password change
    openDialog(): void {
        
        let dialogref = this.dialog.open(PasswordDialogComponent, {
            height: '375px',
            width: '400px',
            data: {} //experimentId: this.experimentID, animalObj: Animal }

        });

        dialogref.afterClosed().subscribe();
    }



}
