import 'rxjs/add/operator/switchMap';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'


@Component({
  selector: 'app-student-class-form',
  templateUrl: './student-class-form.component.html',
  styleUrls: ['./student-class-form.component.css'],
  animations: [fadeInAnimation]
})
export class StudentClassFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;

  studentclass: object = {};

  // objects to contain our dropdown methods
  students: object[];
  classes: object[];
  

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("student_class", +params['id']))
      .subscribe(studentclass => this.studentclass = studentclass);
  }


  // methods to populate our dropdowns
    getStudents(){
      this.dataService.getRecords("student")
      .subscribe(
        students => {this.students = students},
        error =>  this.errorMessage = <any>error);
  }
    getClasses(){
      this.dataService.getRecords("class")
      .subscribe(
        classes => {this.classes = classes},
        error =>  this.errorMessage = <any>error);
  }


  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}


  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        (+params['id']) ? this.getRecordForEdit() : null;
      });

      // populate the dropdowns
      this.getStudents();
      this.getClasses();
  }


  // "studentclass" in this instance is the form that is passed to this method from the view
  saveStudentClass(studentclass: NgForm){
    if(typeof studentclass.value.student_class_id === "number"){
      this.dataService.editRecord("student_class", studentclass.value, studentclass.value.student_class_id)
          .subscribe(
            studentclass => this.successMessage = "Record updated successfully",
            error =>  this.errorMessage = <any>error);
    } else {
      this.dataService.addRecord("student_class", studentclass.value)
          .subscribe(
            studentclass => this.successMessage = "Record added successfully",
            error =>  this.errorMessage = <any>error);
            this.studentclass = {};
    }
  }
}
