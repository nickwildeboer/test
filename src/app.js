import React, { useEffect, useMemo, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';

const efficiencyOptions = [30, 50, 70, 90];

const formatCurrency = (value) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

function App() {
  const [employees, setEmployees] = useState(25);
  const [hourlyWage, setHourlyWage] = useState(45);
  const [hoursPerWeek, setHoursPerWeek] = useState(12);
  const [efficiency, setEfficiency] = useState(50);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [animatedRoi, setAnimatedRoi] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });

  const annualManualCost = useMemo(() => employees * hourlyWage * hoursPerWeek * 52, [employees, hourlyWage, hoursPerWeek]);
  const annualSavings = useMemo(() => annualManualCost * (efficiency / 100), [annualManualCost, efficiency]);
  const monthlySavings = useMemo(() => annualSavings / 12, [annualSavings]);

  const afterValue = annualManualCost - annualSavings;
  const afterPercent = annualManualCost ? (afterValue / annualManualCost) * 100 : 0;

  useEffect(() => {
    const target = efficiency;
    let frame;

    const animate = () => {
      setAnimatedRoi((previous) => {
        const difference = target - previous;
        if (Math.abs(difference) < 0.5) {
          cancelAnimationFrame(frame);
          return target;
        }
        return previous + difference * 0.15;
      });
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [efficiency]);

  const submitForm = (event) => {
    event.preventDefault();
    alert(`Thanks ${formData.name}! We'll reach out with your custom analysis soon.`);
    setShowLeadForm(false);
    setFormData({ name: '', email: '', company: '' });
  };

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-slate-950 text-slate-100' },
    React.createElement(
      'main',
      { className: 'mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:px-10' },
      React.createElement('header', { className: 'space-y-3 text-center' },
        React.createElement('p', { className: 'text-sm font-semibold uppercase tracking-[0.25em] text-brand-400' }, 'AI Automation Agency'),
        React.createElement('h1', { className: 'text-4xl font-bold leading-tight text-white md:text-5xl' }, 'ROI Calculator for AI Automation'),
        React.createElement('p', { className: 'mx-auto max-w-3xl text-slate-300' }, 'Instantly estimate how much your company can save each year by automating repetitive manual tasks.')
      ),
      React.createElement('section', { className: 'grid gap-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl lg:grid-cols-2' },
        React.createElement('div', { className: 'space-y-5' },
          React.createElement(SliderInput, { label: 'Number of Employees', min: 1, max: 500, value: employees, onChange: setEmployees }),
          React.createElement(SliderInput, { label: 'Average Hourly Wage (€)', min: 15, max: 150, value: hourlyWage, onChange: setHourlyWage }),
          React.createElement(SliderInput, { label: 'Manual Task Hours / Week', min: 1, max: 40, value: hoursPerWeek, onChange: setHoursPerWeek }),
          React.createElement('div', { className: 'space-y-2' },
            React.createElement('label', { className: 'text-sm font-medium text-slate-200', htmlFor: 'efficiency' }, 'Estimated AI Efficiency Gain'),
            React.createElement('select', {
              id: 'efficiency',
              value: efficiency,
              onChange: (event) => setEfficiency(Number(event.target.value)),
              className: 'w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-500'
            }, efficiencyOptions.map((value) => React.createElement('option', { key: value, value }, `${value}%`)))
          )
        ),
        React.createElement('div', { className: 'space-y-6 rounded-xl border border-brand-500/20 bg-slate-950/70 p-5' },
          React.createElement('div', { className: 'text-center' },
            React.createElement('p', { className: 'text-sm uppercase tracking-widest text-slate-400' }, 'Projected ROI'),
            React.createElement('p', { className: 'text-6xl font-extrabold text-brand-400' }, `${Math.round(animatedRoi)}%`)
          ),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement(ComparisonBar, { label: 'Before AI', value: annualManualCost, percent: 100, color: 'bg-slate-600' }),
            React.createElement(ComparisonBar, { label: 'After AI', value: afterValue, percent: afterPercent, color: 'bg-brand-500' })
          ),
          React.createElement('table', { className: 'w-full text-left text-sm' },
            React.createElement('tbody', { className: 'divide-y divide-slate-800' },
              React.createElement(TableRow, { label: 'Annual Manual Cost', value: formatCurrency(annualManualCost) }),
              React.createElement(TableRow, { label: 'Annual Savings', value: formatCurrency(annualSavings) }),
              React.createElement(TableRow, { label: 'Monthly Savings', value: formatCurrency(monthlySavings) })
            )
          ),
          React.createElement('button', {
            type: 'button',
            onClick: () => setShowLeadForm(true),
            className: 'w-full rounded-lg bg-brand-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-brand-400'
          }, 'Get Your Custom Analysis')
        )
      )
    ),
    showLeadForm && React.createElement('div', { className: 'fixed inset-0 z-10 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm' },
      React.createElement('div', { className: 'w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl' },
        React.createElement('div', { className: 'mb-4 flex items-center justify-between' },
          React.createElement('h2', { className: 'text-xl font-semibold text-white' }, 'Custom Analysis Request'),
          React.createElement('button', { type: 'button', onClick: () => setShowLeadForm(false), className: 'rounded-md px-2 py-1 text-slate-300 hover:bg-slate-800' }, '✕')
        ),
        React.createElement('form', { className: 'space-y-3', onSubmit: submitForm },
          React.createElement(TextInput, { label: 'Name', value: formData.name, onChange: (value) => setFormData((p) => ({ ...p, name: value })) }),
          React.createElement(TextInput, { label: 'Email', type: 'email', value: formData.email, onChange: (value) => setFormData((p) => ({ ...p, email: value })) }),
          React.createElement(TextInput, { label: 'Company', value: formData.company, onChange: (value) => setFormData((p) => ({ ...p, company: value })) }),
          React.createElement('button', { type: 'submit', className: 'mt-2 w-full rounded-lg bg-brand-500 px-4 py-3 font-semibold text-slate-950 hover:bg-brand-400' }, 'Submit Request')
        )
      )
    )
  );
}

function SliderInput({ label, min, max, value, onChange }) {
  return React.createElement('div', { className: 'space-y-2' },
    React.createElement('div', { className: 'flex items-center justify-between text-sm' },
      React.createElement('label', { className: 'font-medium text-slate-200' }, label),
      React.createElement('span', { className: 'rounded bg-slate-800 px-2 py-1 text-brand-400' }, value)
    ),
    React.createElement('input', {
      type: 'range', min, max, value,
      onChange: (event) => onChange(Number(event.target.value)),
      className: 'h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700',
      style: { accentColor: '#22c55e' }
    })
  );
}

function ComparisonBar({ label, value, percent, color }) {
  return React.createElement('div', { className: 'space-y-1' },
    React.createElement('div', { className: 'flex items-center justify-between text-sm' },
      React.createElement('span', { className: 'font-medium text-slate-200' }, label),
      React.createElement('span', { className: 'text-slate-300' }, formatCurrency(value))
    ),
    React.createElement('div', { className: 'h-4 w-full overflow-hidden rounded-full bg-slate-800' },
      React.createElement('div', {
        className: `h-full ${color} transition-all duration-500`,
        style: { width: `${Math.max(0, Math.min(100, percent))}%` }
      })
    )
  );
}

function TableRow({ label, value }) {
  return React.createElement('tr', null,
    React.createElement('td', { className: 'py-2 text-slate-300' }, label),
    React.createElement('td', { className: 'py-2 text-right font-semibold text-brand-400' }, value)
  );
}

function TextInput({ label, value, onChange, type = 'text' }) {
  return React.createElement('label', { className: 'block text-sm' },
    React.createElement('span', { className: 'mb-1 block text-slate-300' }, label),
    React.createElement('input', {
      required: true,
      type,
      value,
      onChange: (event) => onChange(event.target.value),
      className: 'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-brand-500'
    })
  );
}

createRoot(document.getElementById('root')).render(React.createElement(App));
