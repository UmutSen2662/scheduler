<script>
    import OptionsModal from "./OptionsModal.svelte";
    import CellModal from "./CellModal.svelte";
    import { schedule } from "../../store";
    import Cell from "./Cell.svelte";

    let showOptionsModal = $state(false);
    let startTime = $state(localStorage.getItem("startTime") || "08:40");
    let rowNum = $state(parseInt(localStorage.getItem("rowNum")) || 12);
    let tableData = $state(fillTable($schedule));

    $effect(() => {
        localStorage.setItem("startTime", startTime);
        localStorage.setItem("rowNum", rowNum.toString());
    });

    function fillTable(schedule) {
        let data = [];
        for (let i = 0; i < rowNum; i++) {
            let [hour, minute] = startTime.split(":");
            let row = [`${((i + parseInt(hour)) % 24).toString().padStart(2, "0")}:${minute}`];

            for (let j = 0; j < 5; j++) {
                let found = false;
                if (schedule.length > 0) {
                    schedule.forEach((c) => {
                        if (c.row == i && c.col == j) {
                            row.push(c);
                            found = true;
                        }
                    });
                }
                if (!found) row.push("c" + i.toString(16) + j.toString(16));
            }
            data.push(row);
        }
        return data;
    }

    schedule.subscribe(() => {
        tableData = fillTable($schedule);
    });
</script>

<CellModal />
<OptionsModal bind:showOptionsModal bind:startTime bind:rowNum />
<div class="header">
    <div></div>
    <h2>Schedule</h2>
    <div class="btn">
        <input type="button" value="Options" onclick={() => (showOptionsModal = true)} />
    </div>
</div>
<table>
    <thead>
        <tr>
            <th>Time</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
        </tr>
    </thead>
    <tbody>
        {#each tableData as row}
            <tr>
                <td>{row[0]}</td>
                {#each row.slice(1) as course}
                    <Cell {course} />
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    h2 {
        margin: 0;
        padding: 0.5rem;
        text-align: center;
    }

    .header {
        width: min(40rem, 96%);
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }

    .btn {
        display: flex;
        align-items: end;
        justify-content: end;
        padding: 0.4rem 0.8rem;
    }
    input {
        background: transparent;
        cursor: pointer;
        border: none;
        padding: 0.2rem;
    }
    input:hover {
        text-decoration: underline;
    }

    table {
        font-weight: 700;
        font-size: min(1rem, 2.4vw);
        width: min(40rem, 96%);
        user-select: none;
    }

    th,
    td {
        text-align: center;
        width: 18%;
    }

    th:first-child,
    td:first-child {
        width: auto;
        padding: 0.2em;
    }
</style>
