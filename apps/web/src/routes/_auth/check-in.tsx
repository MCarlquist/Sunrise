import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Slider } from '@sunrise/ui/components/slider'
import { Textarea } from '@sunrise/ui/components/textarea'
import { Button } from '@sunrise/ui/components/button'
import { useForm } from '@tanstack/react-form'

import { client } from '@/utils/orpc'

export const Route = createFileRoute('/_auth/check-in')({
  component: RouteComponent,
})

type MoodSelectProps = {
  name: string
  value: string
  moods: string[]
  onBlur: () => void
  onChange: (mood: string) => void
}

function MoodSelect({ name, value, moods, onBlur, onChange }: MoodSelectProps) {
  return (
    <div className='flex flex-row flex-wrap gap-10'>
      {moods.map((mood) => (
        <label key={mood} className='flex cursor-pointer items-center gap-2'>
          <input
            type='radio'
            name={name}
            value={mood}
            checked={value === mood}
            onBlur={onBlur}
            onChange={() => onChange(mood)}
          />
          <span>{mood}</span>
        </label>
      ))}
    </div>
  )
}

function RouteComponent() {
  const moods = ['Happy', 'Sad', 'Angry', 'Stressed']
  const influences = ['Sleep', 'Work', 'Weather', 'Relationships', 'Being-Proud', 'Self-Recovery']

  const form = useForm({
    defaultValues: {
      mood: '',
      influence: '',
      wellbeingScore: [1],
      notes: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await client.createCheckIn({
          mood: value.mood as 'Happy' | 'Sad' | 'Angry' | 'Stressed',
          influence: value.influence as
            | 'Sleep'
            | 'Work'
            | 'Weather'
            | 'Relationships'
            | 'Being-Proud'
            | 'Self-Recovery',
          wellbeingScore: value.wellbeingScore[0] ?? 1,
          notes: value.notes,
        })
        toast.success('Check-in saved')
        form.reset()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to save check-in')
      }
    },
  })

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}>
        <div className='grid grid-cols-5 grid-rows-6'>
          <div className='col-span-5 mb-8'>
            <h2 className='text-3xl'>How Are You Feeling Today?</h2>
            <p className='text-foreground'>Take a moment to reflect on how you're feeling.</p>
          </div>
          <div className='col-span-3 row-start-2'>
            <p className='text-foreground'>Select your current mood</p>
            <div className='flex justify-center mt-2'>
              <form.Field
                name='mood'
                children={(field) => (
                  <MoodSelect
                    name={field.name}
                    value={field.state.value ?? ''}
                    moods={moods}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                  />
                )}
              />
            </div>
          </div>
          <div className='col-span-3 row-start-3'>
            <p>Overall wellbeing score.</p>
            <form.Field
              name='wellbeingScore'
              children={(field) => (
                <div>
                  <div className='flex flex-row gap-10'>
                    <span>1 - Struggling</span><span>5 - Balanced</span><span>10 - Great</span>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-200 m-2'>
                      <span className='font-semibold text-green-900'>
                        {field.state.value}
                      </span>
                    </div>
                  </div>
                  <Slider
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onValueChange={(value) => field.handleChange(value as number[])}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>
              )}
            />
          </div>
          <div className='col-span-4 row-start-4 mt-4'>
            <p>What's influencing your day?</p>
            <form.Field
              name='influence'
              children={(field) => (
                <ul className='flex flex-row flex-wrap gap-10 justify-center mt-2'>
                  {influences.map((influence) => (
                    <li key={influence}>
                      <label className='flex cursor-pointer items-center gap-2'>
                        <input
                          type='radio'
                          name={field.name}
                          value={influence}
                          checked={field.state.value === influence}
                          onBlur={field.handleBlur}
                          onChange={() => field.handleChange(influence)}
                        />
                        <span className='text-[12px]'>{influence}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            />
          </div>
          <div className='col-span-3 row-start-5'>
            <p>Anything you'd like to note about today?</p>
            <form.Field
              name='notes'
              children={(field) => (
                <Textarea
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder='Today felt good, because...'
                />
              )}
            />
          </div>
          <div className='col-span-3 row-start-6 flex justify-end'>
            <form.Subscribe
              selector={(state) => state.isSubmitting}
              children={(isSubmitting) => (
                <Button
                  className='bg-green-500 text-white px-4 py-2 rounded'
                  disabled={isSubmitting}
                  type='submit'
                >
                  {isSubmitting ? 'Saving...' : 'Save Check-in'}
                </Button>
              )}
            />
          </div>
        </div>
      </form>
    </div>
  )
}
