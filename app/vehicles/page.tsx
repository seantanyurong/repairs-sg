import { Vehicle, columns } from "./columns"
import { DataTable } from "./dataTable"

async function getData(): Promise<Vehicle[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            plateNumber: "SKM1234Y",
            gpsAPI: "traccar.api",
        },
        // ...
    ]
}

export default async function DemoPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
