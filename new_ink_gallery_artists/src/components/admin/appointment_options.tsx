export const recurring_rules =  [
    { value: "RRULE:FREQ=DAILY", label: "Every day" },
    { value: "RRULE:FREQ=WEEKLY", label: "Once a week" },
    { value: "RRULE:FREQ=WEEKLY;INTERVAL=2", label: "Every 2 weeks" },
    { value: "RRULE:FREQ=WEEKLY;INTERVAL=3", label: "Every 3 weeks" },
    { value: "RRULE:FREQ=WEEKLY;INTERVAL=4", label: "Every 4 weeks" },
    { value: "RRULE:FREQ=WEEKLY;INTERVAL=5", label: "Every 5 weeks" },
    { value: "RRULE:FREQ=WEEKLY;INTERVAL=6", label: "Every 6 weeks" },
    { value: "RRULE:FREQ=WEEKLY;INTERVAL=7", label: "Every 7 weeks" },
    { value: "RRULE:FREQ=WEEKLY;INTERVAL=8", label: "Every 8 weeks" },
    { value: "RRULE:FREQ=WEEKLY;INTERVAL=9", label: "Every 9 weeks" },
    { value: "RRULE:FREQ=WEEKLY;INTERVAL=10", label: "Every 10 weeks" },
    { value: "RRULE:FREQ=WEEKLY;INTERVAL=11", label: "Every 11 weeks" },
    { value: "RRULE:FREQ=WEEKLY;INTERVAL=12", label: "Every 12 weeks" },
    { value: "RRULE:FREQ=MONTHLY;INTERVAL=1", label: "Once a month" },
    { value: "RRULE:FREQ=MONTHLY;INTERVAL=2", label: "Every 2 months" },
    { value: "RRULE:FREQ=MONTHLY;INTERVAL=3", label: "Every 3 months" },
    { value: "RRULE:FREQ=MONTHLY;INTERVAL=4", label: "Every 4 months" },
    { value: "RRULE:FREQ=MONTHLY;INTERVAL=6", label: "Every 6 months" },
    { value: "RRULE:FREQ=MONTHLY;INTERVAL=18", label: "Every 18 months" },
    { value: "RRULE:FREQ=YEARLY;INTERVAL=1", label: "Once a year" },
    { value: "RRULE:FREQ=YEARLY;INTERVAL=2", label: "Every 2 years" },
    { value: "RRULE:FREQ=YEARLY;INTERVAL=3", label: "Every 3 years" }
  ];


export const lengths =  [
5,
10,
15,
20,
25,
30,
35,
40,
45,
50,
55,
60,
75,
90,
105,
120,
135,
150,
165,
180,
210,
240,
270,
300,
330,
360,
390,
420,
450,
480,
540,
600,
660,
720,
780,
840,
900,
960
]


export const formatLengthLabel = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  let parts = [];
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (mins > 0) parts.push(`${mins} minute${mins > 1 ? 's' : ''}`);
  return parts.join(" ");
};