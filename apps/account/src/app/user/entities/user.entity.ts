import { IUser, IUserCourses, PurchaseState, UserRole } from "@account/interfaces";
import { compare, genSalt, hash } from "bcrypt";

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses: IUserCourses[];

  constructor(user: IUser) {
    this._id = user._id;
    this.passwordHash = user.passwordHash;
    this.displayName = user.displayName;
    this.email = user.email;
    this.role = user.role;
    this.courses = user.courses;
  }

  public addCourse(courseId: string) {
    const existingCourse = this.courses.find(course => course._id === courseId);
    if (existingCourse) {
      throw new Error('Such course already exists');
    }
    this.courses.push({
      courseId,
      purchase: PurchaseState.Started
    })
  }

  public deleteCourse(courseId: string) {
    this.courses = this.courses.filter(course => course._id !== courseId);
  }

  public updateCourseStatus(courseId: string, state: PurchaseState) {
    this.courses = this.courses.map(course => {
      if (course._id === courseId) {
        course.purchase = state;
        return course;
      }
      return course;
    })
  }

  

  public getPublicProfile() {
    return {
      email: this.email,
      role: this.role,
      displayName: this.displayName
    }
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public validatePassword(password: string) {
    return compare(password, this.passwordHash);
  }

  public updateProfile(displayName: string) {
    this.displayName = displayName;
    return this;
  }
}
