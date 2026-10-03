import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Slider } from '@sunrise/ui/components/slider'
import { Textarea } from '@sunrise/ui/components/textarea'
import { Button } from '@sunrise/ui/components/button'


export const Route = createFileRoute('/_auth/check-in')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const moods = ['Happy', 'Sad', 'Angry', 'Stressed']
  const [selectedInfluence, setSelectedInfluence] = useState<string | null>(null)
  const influences = ['Sleep', 'Work', 'Weather', 'Relationships', 'Being-Proud', 'Self-Recovery']

  const [wellbeingScore, setWelbeingScore] = useState([0.0])

  return (
    <div>
      <div className='grid grid-cols-5 grid-rows-6'>
        <div className='col-span-5 mb-8'>
          <h2 className='text-3xl'>How Are You Feeling Today?</h2>
          <p className='text-foreground'>Take a moment to reflect on how you're feeling.</p>
        </div>
        <div className='col-span-3 row-start-2'>
          <p className='text-foreground'>Select your current mood</p>
          <ul className='flex flex-row gap-10 justify-center mt-2'>
            {moods.map((mood) => (
              <li key={mood}>
                <label>
                  <input
                    type='radio'
                    name='mood'
                    value={mood}
                    checked={selectedMood === mood}
                    onChange={() => setSelectedMood(mood)}
                  />
                  {mood}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className='col-span-3 row-start-3'>
          <p>Overall wellbeing score.</p>
          <div className='flex flex-row gap-10'>
            <span>1 - Struggling</span><span>5 - Balanced</span><span>10 - Great</span>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-200 m-2">
              <span className="font-semibold text-green-900">
                {wellbeingScore}
              </span>
            </div>

          </div>
          <Slider value={wellbeingScore} onValueChange={(value) => setWelbeingScore(value as number[])} min={0} max={10} step={1} />
        </div>
        <div className='col-span-3 row-start-4 mt-4'>
          <p>What's influencing your day?</p>
          <ul className='flex flex-row gap-10 justify-center mt-2'>
            {influences.map((influence) => (
              <li key={influence}>
                <label>
                  <input
                    type='radio'
                    name='influence'
                    value={influence}
                    checked={selectedInfluence === influence}
                    onChange={() => setSelectedInfluence(influence)}
                  />
                  <span className='text-[12px]'>{influence}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className='col-span-3 row-start-5'>
          <p>Anything you'd like to not about today?</p>
          <Textarea placeholder='Today felt good, because...'/>
        </div>
        <div className='col-span-3 row-start-6 flex justify-end'>
          <Button className='bg-green-500 text-white px-4 py-2 rounded'>Save Check-in</Button>
        </div>
      </div>

    </div>
  )
}
