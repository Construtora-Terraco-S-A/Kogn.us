import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-authorized',
  imports: [RouterModule],
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss'],
  standalone: true,
})
export class NotAuthorized {
}
