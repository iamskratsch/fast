import { html, ViewTemplate, when } from "@microsoft/fast-element";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import {
    VirtualList as FoundationVirtualList,
    SizeMap,
    VirtualListItem,
} from "@microsoft/fast-foundation";
import VirtualListTemplate from "./fixtures/base.html";

let data;
let dataSizeMap;
let gridData: object[];

const horizontalImageItemTemplate = html`
    <fast-card
        style="
            position: absolute;
            contain: strict;
            height:  100%;
            width:  ${(x, c) => `${c.parent.visibleItemMap[c.index]?.size}px`};
            transform: ${(x, c) =>
            `translateX(${c.parent.visibleItemMap[c.index]?.start}px)`};
        "
    >
        <div style="margin: 5px 20px 0 20px; color: white">
            ${x => x.title}
        </div>

        <div
            style="
                height: 160px;
                width:160px;
                margin:10px 20px 10px 20px;
                position: absolute;
                background-image: url('${x => x.url}');
            "
        ></div>
    </fast-card>
`;

const verticalImageItemTemplate = html`
    <fast-card
        style="
            position: absolute;
            contain: strict;
            height:  200px;
            width:  100%;
            transform: ${(x, c) =>
            `translateY(${c.parent.visibleItemMap[c.index]?.start}px)`};
        "
    >
        <div style="margin: 5px 20px 0 20px; color: white">
            ${x => x.title}
        </div>

        <div
            style="
                height: 160px;
                width:160px;
                margin:10px 20px 10px 20px;
                position: absolute;
                background-image: url('${x => x.url}');
            "
        ></div>
    </fast-card>
`;

const gridItemTemplate = html`
    <div
        style="
            contain: strict;
            position: absolute;
            height: 200px;
            width:  200px;
            transform: ${(x, c) =>
            `translateX(${c.parent.visibleItemMap[c.index]?.start}px)`};
        "
    >
        <div
            style="
            position: absolute;
            margin: 90px 20px 0 20px;
        "
        >
            ${x => x.title}
        </div>

        <div
            style="
                background: gray;
                height:100%;
                width:100%;
                background-image: url('${x => x.url}');
            "
        ></div>
    </div>
`;

const rowItemTemplate = html`
    <fast-virtual-list
        auto-update-mode="auto"
        orientation="horizontal"
        item-size="200"
        viewport-buffer="100"
        :viewportElement="${(x, c) => c.parent.viewportElement}"
        :itemTemplate="${gridItemTemplate}"
        :items="${x => x.items}"
        style="
            display: block;
            position: absolute;
            height:  200px;
            transform: ${(x, c) =>
            `translateY(${c.parent.visibleItemMap[c.index]?.start}px)`};
        "
    ></fast-virtual-list>
`;

const listItemContentsTemplate = html`
    <fast-card>
        <div style="margin: 5px 20px 0 20px; color: white">
            ${x => x.listItemContext.titleString} ${x => x.itemData.title}
        </div>
        ${when(
            x => x.loadContent,
            html`
                <div
                    style="
                height: 160px;
                width:160px;
                margin:10px 20px 10px 20px;
                position: absolute;
                background-image: url('${x => x.itemData.url}');
            "
                ></div>
                <div
                    style="
                        height: 120px;
                        margin:60px 10px 10px 10px;
                        opacity: 0.5;
                        display: flex;
                        flex-direction: row;
                    "
                ></div>
            `
        )}
        ${when(
            x => !x.loadContent,
            html`
                <div
                    style="
                    background: white;
                    opacity: 0.2;
                    height: 160px;
                    width:160px;
                    margin:10px 20px 10px 20px;
                    position: absolute;
            "
                ></div>
            `
        )}
    </fast-card>
`;

const variableHeightContentsTemplate = html`
    <div
        style="
            margin: 4px 0 4px 0;
            width: 100%;
            height: calc(100% - 8px);
        "
    >
        <button
            style="
            width: 100%;
            height: 100%;
            background-image: url('${x => x.itemData.url}');
        "
        >
            <div style="background-color: white">
                ${x => x.listItemContext.titleString} ${x => x.itemData.title}
            </div>
        </button>
    </div>
`;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("virtual-list")) {
        data = newDataSet(10000, 1);
        dataSizeMap = generateSizeMap(data);

        gridData = [];

        for (let i = 1; i <= 1000; i++) {
            gridData.push({
                items: newDataSet(1000, i),
            });
        }

        const stackh1 = document.getElementById("stackh1") as FoundationVirtualList;
        stackh1.listItemTemplate = listItemContentsTemplate;
        stackh1.listItemContext = {
            titleString: "title:",
        };
        stackh1.items = newDataSet(50, 1);

        const stackh2 = document.getElementById("stackh2") as FoundationVirtualList;
        stackh2.listItemTemplate = listItemContentsTemplate;
        stackh2.listItemContext = {
            titleString: "title:",
        };
        stackh2.items = data;

        const stackhImmediate = document.getElementById(
            "stackhimmediate"
        ) as FoundationVirtualList;
        stackhImmediate.listItemTemplate = listItemContentsTemplate;
        stackhImmediate.listItemContext = {
            titleString: "title:",
        };
        stackhImmediate.items = data;

        const stackh3 = document.getElementById("stackh3") as FoundationVirtualList;
        stackh3.itemTemplate = horizontalImageItemTemplate;
        stackh3.items = data;

        const stackh4 = document.getElementById("stackh4") as FoundationVirtualList;
        stackh4.itemTemplate = horizontalImageItemTemplate;
        stackh4.items = data;

        const stackGrid = document.getElementById("stackgrid") as FoundationVirtualList;
        stackGrid.itemTemplate = rowItemTemplate;
        stackGrid.items = gridData;

        const stackv1 = document.getElementById("stackv1") as FoundationVirtualList;
        stackv1.viewportElement = document.documentElement;
        stackv1.listItemTemplate = variableHeightContentsTemplate;
        stackv1.listItemContext = {
            titleString: "title:",
        };
        stackv1.items = data;
        stackv1.onclick = toggleSize;

        const stackv2 = document.getElementById("stackv2") as FoundationVirtualList;
        stackv2.items = data;
        stackv2.listItemTemplate = listItemContentsTemplate;
        stackv2.listItemContext = {
            titleString: "title:",
        };

        const stackv3 = document.getElementById("stackv3") as FoundationVirtualList;
        stackv3.sizemap = dataSizeMap;
        stackv3.items = data;
        stackv3.viewportElement = document.documentElement;
        stackv3.listItemTemplate = variableHeightContentsTemplate;
        stackv3.listItemContext = {
            titleString: "title:",
        };
        stackv3.onclick = toggleSizeMap;

        const reloadImmediateButton = document.getElementById("reloadimmediate");
        if (reloadImmediateButton) {
            reloadImmediateButton.onclick = reloadImmediate;
        }

        const reloadIdleButton = document.getElementById("reloadidle");
        if (reloadIdleButton) {
            reloadIdleButton.onclick = reloadIdle;
        }
    }
});

function toggleSize(e: PointerEvent): void {
    const listItem: HTMLElement = e.target as HTMLElement;
    if (listItem.clientHeight === 200) {
        listItem.style.height = "60px";
    } else {
        listItem.style.height = "200px";
    }
}

function toggleSizeMap(e: PointerEvent): void {
    const stackv3 = document.getElementById("stackv3") as FoundationVirtualList;
    const index: number = (e.target as VirtualListItem).itemIndex;

    let currentPosition: number = 0;
    const toggleMap: SizeMap[] = stackv3.sizemap.slice(0, index);

    if (index > 0) {
        currentPosition = toggleMap[index - 1].end;
    }

    const changeSize: number = stackv3.sizemap[index].size === 60 ? 200 : 60;

    toggleMap.push({
        start: currentPosition,
        size: changeSize,
        end: currentPosition + changeSize,
    });

    const mapLength: number = stackv3.sizemap.length;

    for (let i: number = index + 1; i < mapLength; i++) {
        currentPosition = toggleMap[i - 1].end;

        toggleMap.push({
            start: currentPosition,
            size: stackv3.sizemap[i].size,
            end: currentPosition + stackv3.sizemap[i].size,
        });
    }

    // stackv3.sizemap.splice(0, stackv3.sizemap.length, ...toggleMap);

    stackv3.sizemap = toggleMap;
}

function reloadImmediate(): void {
    const stackhImmediate = document.getElementById(
        "stackhimmediate"
    ) as FoundationVirtualList;
    stackhImmediate.items = [];
    window.setTimeout(() => {
        stackhImmediate.items = data;
    }, 50);
}

function reloadIdle(): void {
    const stackhIdle = document.getElementById("stackh2") as FoundationVirtualList;
    stackhIdle.items = [];
    window.setTimeout(() => {
        stackhIdle.items = data;
    }, 50);
}

function newDataSet(rowCount: number, prefix: number): object[] {
    const newData: object[] = [];
    for (let i = 1; i <= rowCount; i++) {
        newData.push({
            value: `${i}`,
            title: `item #${i}`,
            url: `https://picsum.photos/200/200?random=${prefix * 1000 + i}`,
        });
    }
    return newData;
}

function generateSizeMap(data: object[]) {
    const sizemap: SizeMap[] = [];
    const itemsCount: number = data.length;
    let currentPosition: number = 0;
    const itemBaseSize: number = 60;
    for (let i = 0; i < itemsCount; i++) {
        const mapEnd = itemBaseSize + currentPosition;
        sizemap.push({
            start: currentPosition,
            size: itemBaseSize,
            end: mapEnd,
        });
        currentPosition = mapEnd;
    }
    return sizemap;
}

export default {
    title: "Virtual List",
};

export const VirtualList = () => VirtualListTemplate;
