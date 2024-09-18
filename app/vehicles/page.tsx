import Link from 'next/link'
import { Vehicle, columns } from "./columns"
import { DataTable } from "./dataTable"
import { Button } from "@/components/ui/button"

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

export default async function Vehicles() {
    const data = await getData()

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white">
            <div className="container mx-auto py-10 text-black relative">
                <div className="flex items-center justify-end space-x-2 py-4 mt-4">
                    <Link href="/vehicles/register">
                        <Button className="bg-white text-black hover:bg-gray-50">
                            Register new vehicle
                        </Button>
                    </Link>
                </div>

                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}
