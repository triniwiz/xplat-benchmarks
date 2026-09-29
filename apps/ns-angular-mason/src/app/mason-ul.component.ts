import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewContainerRef,
  forwardRef,
  inject,
  type TemplateRef,
} from '@angular/core';
import { DetachedLoader, NsTemplatedItem, TEMPLATED_ITEMS_COMPONENT, type ItemContext } from '@nativescript/angular';
import type { View } from '@nativescript/core';

@Component({
  selector: 'Ul',
  template: `<DetachedContainer><ng-container #loader></ng-container></DetachedContainer>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DetachedLoader],
  providers: [{ provide: TEMPLATED_ITEMS_COMPONENT, useExisting: forwardRef(() => MasonUlComponent) }],
  host: { '(itemLoading)': 'onItemLoading($event)' },
})
export class MasonUlComponent<T = any> implements AfterContentInit {
  private readonly ul: any = inject(ElementRef).nativeElement;
  private readonly templates = new Map<string, NsTemplatedItem<T>>();
  private readonly viewKey = new WeakMap<View, string>();
  private _items: T[] = [];

  @ViewChild('loader', { read: ViewContainerRef, static: true }) loader!: ViewContainerRef;

  @Input() set items(value: T[]) {
    this._items = value;
    this.ul.items = value;
  }

  registerTemplate(key: string, template: TemplateRef<ItemContext<T>>) {
    this.templates.set(key, new NsTemplatedItem(template, this.loader, (v) => this.viewKey.set(v, key)));
  }

  ngAfterContentInit() {
    const templates: { key: string; createView: () => View }[] = [];
    this.templates.forEach((t, key) => {
      t.location = this.loader;
      templates.push({ key, createView: () => t.create() });
    });
    this.ul.itemTemplates = templates;
    this.ul.items = this._items;
  }

  onItemLoading(args: any) {
    const t = this.templates.get(this.viewKey.get(args.view)!);
    if (!t) return;
    t.update(args.view, { index: args.index, data: this._items[args.index] });
    t.attach(args.view);
  }
}
