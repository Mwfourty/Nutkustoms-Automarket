import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LightRays from '../components/effects/LightRays';
import Navbar from '../components/store/Navbar';
import Footer from '../components/store/Footer';
import StepSidebar from '../components/sell/StepSidebar';
import PhotoUploader from '../components/sell/PhotoUploader';
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from '../components/sell/fields';
import {
  CONDITIONS,
  DOCUMENTS,
  MAKES,
  SERVICE_HISTORY,
  STEPS,
  TRANSMISSIONS,
  YEARS,
  emptyDraft,
  isStepValid,
  type ListingDraft,
} from '../components/sell/listingDraft';
import { useTheme } from '../context/ThemeContext';

const SellPage = () => {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ListingDraft>(emptyDraft);
  const [published, setPublished] = useState(false);

  const update = <K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const isLast = step === STEPS.length - 1;
  const canContinue = isStepValid(step, draft);

  const toggleDocument = (doc: string, checked: boolean) =>
    update(
      'documents',
      checked ? [...draft.documents, doc] : draft.documents.filter((d) => d !== doc),
    );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField label="Make" value={draft.make} options={MAKES} onChange={(v) => update('make', v)} />
            <TextField label="Model" value={draft.model} placeholder="e.g. E36 328i" onChange={(v) => update('model', v)} />
            <SelectField label="Year" value={draft.year} options={YEARS} onChange={(v) => update('year', v)} />
            <SelectField label="Transmission" value={draft.transmission} options={TRANSMISSIONS} onChange={(v) => update('transmission', v)} />
            <TextField label="Mileage (km)" value={draft.mileage} inputMode="numeric" placeholder="e.g. 212000" onChange={(v) => update('mileage', v.replace(/\D/g, ''))} />
            <SelectField label="Condition" value={draft.condition} options={CONDITIONS} onChange={(v) => update('condition', v)} />
          </div>
        );
      case 1:
        return <PhotoUploader photos={draft.photos} onChange={(p) => update('photos', p)} />;
      case 2:
        return (
          <div className="flex flex-col gap-4">
            <SelectField label="Service history" value={draft.serviceHistory} options={SERVICE_HISTORY} onChange={(v) => update('serviceHistory', v)} />
            <TextAreaField label="Modifications" rows={4} value={draft.modifications} placeholder="List any aftermarket parts or changes" onChange={(v) => update('modifications', v)} />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {DOCUMENTS.map((doc) => (
                <CheckboxField key={doc} label={doc} checked={draft.documents.includes(doc)} onChange={(c) => toggleDocument(doc, c)} />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-4">
            <TextField label="Listing title" value={draft.title} placeholder="e.g. 1998 BMW E36 328i Manual" onChange={(v) => update('title', v)} />
            <TextField label="Asking price (R)" value={draft.price} inputMode="numeric" placeholder="e.g. 85000" onChange={(v) => update('price', v.replace(/\D/g, ''))} />
            <CheckboxField label="Price is negotiable" checked={draft.negotiable} onChange={(c) => update('negotiable', c)} />
            <TextAreaField label="Description" rows={6} value={draft.description} placeholder="Tell buyers what makes this one special" onChange={(v) => update('description', v)} />
          </div>
        );
      default:
        return (
          <dl className="grid grid-cols-1 gap-x-8 gap-y-4 text-sm md:grid-cols-2">
            {[
              ['Title', draft.title],
              ['Vehicle', `${draft.year} ${draft.make} ${draft.model}`],
              ['Transmission', draft.transmission],
              ['Mileage', `${Number(draft.mileage).toLocaleString('en-ZA')} km`],
              ['Condition', draft.condition],
              ['Service history', draft.serviceHistory],
              ['Documents', draft.documents.join(', ') || 'None'],
              ['Photos', `${draft.photos.length}`],
              ['Price', `R ${Number(draft.price).toLocaleString('en-ZA')}${draft.negotiable ? ' (negotiable)' : ''}`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-neutral-500">{label}</dt>
                <dd className="mt-0.5 font-medium text-white light:text-neutral-900">{value}</dd>
              </div>
            ))}
          </dl>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-black transition-colors light:bg-[#f7f5f0]">
      <div className="pointer-events-none fixed inset-0 h-screen">
        <LightRays
          raysOrigin="top-center"
          raysColor="#fff3c4"
          raysSpeed={0.6}
          lightSpread={0.7}
          rayLength={1.8}
          followMouse
          mouseInfluence={0.08}
          fadeDistance={1.1}
          saturation={0.9}
          lightMode={theme === 'light'}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-10">
          <StepSidebar current={step} onSelect={setStep} />

          <section className="flex-1 rounded-3xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-8 light:border-black/10 light:bg-white/80 light:shadow-sm">
            {published ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <CheckCircle2 size={40} className="text-amber-300" strokeWidth={1.5} />
                <h1 className="font-display text-2xl text-white light:text-neutral-900">
                  Listing published
                </h1>
                <p className="text-sm text-neutral-500">
                  Your listing is now live on Automarket.
                </p>
                <Link
                  to="/"
                  className="mt-4 rounded-lg bg-white px-5 py-2.5 font-display text-sm text-black light:bg-neutral-900 light:text-white"
                >
                  Back to browse
                </Link>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h1 className="font-display text-2xl font-semibold text-white light:text-neutral-900">
                      {STEPS[step].title}
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                      {isLast ? 'Make sure everything looks right.' : 'Tell us about the car you\u2019re listing.'}
                    </p>
                  </div>
                  <span className="text-xs text-neutral-500">
                    Step {step + 1} of {STEPS.length}
                  </span>
                </div>

                <div className="mt-6 sm:mt-8">{renderStep()}</div>

                <div className="mt-6 flex items-center justify-between gap-3 sm:mt-8">
                  <button
                    type="button"
                    disabled={step === 0}
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-2.5 font-display text-sm text-neutral-200 transition-colors hover:border-white/25 disabled:opacity-40 light:border-black/10 light:bg-white light:text-neutral-800"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!canContinue}
                    onClick={() => (isLast ? setPublished(true) : setStep(step + 1))}
                    className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-display text-sm text-black transition-opacity disabled:opacity-40 light:bg-neutral-900 light:text-white"
                  >
                    {isLast ? 'Publish' : 'Continue'}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default SellPage;
