import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Point } from '../interfaces/point';
import { User } from '../interfaces/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PointService {

  private pointsCollection: AngularFirestoreCollection<Point>;

  constructor(private afs: AngularFirestore) {
    this.pointsCollection = this.afs.collection<Point>('Points', ref => ref.orderBy('createdAt','desc'));
  }

  addPoint(point: Point, id: string) {
    return this.pointsCollection.add(point);    
  }

  getPointsUsers(idUser: string) {
      this.pointsCollection = this.afs.collection<Point>('Points', ref => ref.where('userId','==',idUser));
      return this.pointsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getPoints(){
      //this.pointsCollection = this.afs.collection<Point>('Points', ref => ref.orderBy('createdAt','desc'));
      return this.pointsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          //console.log(data);
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getPoint(id: string) {
    return this.pointsCollection.doc<Point>(id).valueChanges();
  }

  updatePoint(id: string, point: Point) {
    return this.pointsCollection.doc(id).update(point);
  }

  
  deletePoint(id: string) {
    return this.pointsCollection.doc(id).delete();
  }
}
