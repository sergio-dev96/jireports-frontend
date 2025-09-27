import { Input, ElementRef, Inject, TemplateRef, Directive, OnInit, OnChanges, OnDestroy, SimpleChanges, ViewChildren, QueryList, Renderer2, AfterViewInit } from '@angular/core';
import { GanttItemInternal, GanttItemType } from './class';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { rangeHeight } from './gantt.styles';
import { GANTT_UPPER_TOKEN, GanttUpper } from './gantt-upper';

@Directive()
export abstract class GanttItemUpper implements OnChanges, OnInit, OnDestroy, AfterViewInit {
    @Input() template: TemplateRef<any>;

    @Input() item: GanttItemInternal;

    public firstChange = true;

    public unsubscribe$ = new Subject<void>();

    public refsUnsubscribe$ = new Subject<void>();

    public eventRefsUnsubscribe$ = new Subject<void>();

    @ViewChildren('eventDiv', { read: ElementRef }) eventDivs!: QueryList<ElementRef>;

    constructor(protected elementRef: ElementRef<HTMLElement>, @Inject(GANTT_UPPER_TOKEN) protected ganttUpper: GanttUpper,
        protected renderer: Renderer2) { }

    ngOnInit() {
        this.firstChange = false;
        this.item.refs$.pipe(takeUntil(this.refsUnsubscribe$)).subscribe(() => {
            this.setPositions();
        });
    }
    ngAfterViewInit(): void {
        this.item.eventRefs$.pipe(takeUntil(this.eventRefsUnsubscribe$)).subscribe(() => {
            this.setEventPositions();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.firstChange) {
            this.itemChange(changes.item.currentValue);
        }
    }

    private itemChange(item: GanttItemInternal) {
        this.refsUnsubscribe$.next();
        this.refsUnsubscribe$.complete();
        this.item = item;
        this.item.refs$.pipe(takeUntil(this.refsUnsubscribe$)).subscribe(() => {
            this.setPositions();
        });

        this.eventRefsUnsubscribe$.next();
        this.eventRefsUnsubscribe$.complete();
        this.item.eventRefs$.pipe(takeUntil(this.eventRefsUnsubscribe$)).subscribe(() => {
            this.setEventPositions();
        });
    }

    private setPositions() {
        const itemElement = this.elementRef.nativeElement;
        itemElement.style.left = this.item.refs?.x + 'px';
        itemElement.style.top = this.item.refs?.y + 'px';
        itemElement.style.width = this.item.refs?.width + 'px';
        if (this.item.type === GanttItemType.bar) {
            itemElement.style.height = this.ganttUpper.styles.barHeight + 'px';
        } else if (this.item.type === GanttItemType.range) {
            itemElement.style.height = rangeHeight + 'px';
        }
    }

    private setEventPositions() {
        if (this.item.origin.events && this.eventDivs && this.eventDivs.length > 0 && this.item.eventRefs) {
            console.log('seteventposition', this.item);
            this.eventDivs.forEach((eventDiv, index) => {
                const itemElement = eventDiv.nativeElement;
                itemElement.style.background = this.item.eventRefs.at(index)?.color || '#fff';
                itemElement.style.left = (this.item.eventRefs.at(index)?.x - this.item.refs?.x) + 'px';
                itemElement.style.top = 2 + 'px';
                itemElement.style.width = this.item.eventRefs.at(index)?.width + 'px';
                if (this.item.type === GanttItemType.bar) {
                    itemElement.style.height = (this.ganttUpper.styles.barHeight - 4) + 'px';
                } else if (this.item.type === GanttItemType.range) {
                    itemElement.style.height = rangeHeight + 'px';
                }
            });
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.refsUnsubscribe$.next();
        this.refsUnsubscribe$.complete();
        this.eventRefsUnsubscribe$.next();
        this.eventRefsUnsubscribe$.complete();
    }
}
