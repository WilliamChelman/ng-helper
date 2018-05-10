import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'lib-lib-a',
    template: `
    <p>
      lib-a works!
    </p>
  `,
    styles: []
})
export class LibAComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
