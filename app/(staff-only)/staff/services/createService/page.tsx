import { addService } from '@/lib/actions/services';

export default async function CreateService() {
  return (
    <form action={addService}>
      <div>
        <label>Name</label>
        <input name='name' type='text' />
      </div>
      <button>Submit</button>
    </form>
  );
}
