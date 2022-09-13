import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private userCollection: AngularFirestoreCollection<User>;

  constructor(private afa: AngularFireAuth, private afs: AngularFirestore) { }

  login(user: User){
  	return this.afa.auth.signInWithEmailAndPassword(user.email,user.password);
  }

  async register(user: User){
  	const newUser = await this.afa.auth.createUserWithEmailAndPassword(user.email,user.password);
    await this.afs.collection('Users').doc(newUser.user.uid).set(user);
  }

  logout(){
  	return this.afa.auth.signOut();
  }

  getUser(id: string) {
    this.userCollection = this.afs.collection<User>('Users');
    return this.userCollection.doc(id).valueChanges();
  }

  getAuth(){
  	return this.afa.auth;
  }
}
