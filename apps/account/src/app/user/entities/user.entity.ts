import { AccountChangeCourse } from "@account/contracts";
import { IDomainEvent, IUser, IUserCourses, PurchaseState, UserRole } from "@account/interfaces";
import { compare, genSalt, hash } from "bcrypt";

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses: IUserCourses[];
  events: IDomainEvent[] = [];

  constructor(user: IUser) {
    this._id = user._id;
    this.passwordHash = user.passwordHash;
    this.displayName = user.displayName;
    this.email = user.email;
    this.role = user.role;
    this.courses = user.courses;
  }

  public setCourseStatus(courseId: string, state: PurchaseState) {
    const existingCourse = this.courses.find(course => course._id === courseId);
    if (!existingCourse) {
      this.courses.push({
        courseId,
        purchaseState: state
      })
      return this;
    }
    if (state = PurchaseState.Cancelled) {
      this.courses = this.courses.filter(course => course._id !== courseId);
    }
    this.courses = this.courses.map(course => {
      if (course._id === courseId) {
        course.purchaseState = state;
        return course;
      }
      return course;
    })
    this.events.push({
      topic: AccountChangeCourse.topic,
      data: { courseId, userId: this._id, state }
    });
    return this;
  }

	public getCourseState(courseId: string): PurchaseState {
		return this.courses.find(c => c.courseId === courseId)?.purchaseState ?? PurchaseState.Started;
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
