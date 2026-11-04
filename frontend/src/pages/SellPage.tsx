import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../services/apiClient';
import { publishListing } from '../services/sellApi';
import { clearClientSession, isLoggedIn } from '../services/session';
import StepSidebar from '../components/sell/StepSidebar';
import PhotoUploader from '../components/sell/PhotoUploader';
import { CategoryStep, DetailsStep } from '../components/sell/CategoryFields';
import { reviewRows } from '../components/sell/reviewRows';
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from '../components/sell/fields';
import {
  DOCUMENTS,
  SERVICE_HISTORY,
  emptyDraft,
  isStepValid,
  stepsFor,
  type ListingDraft,
} from '../components/sell/listingDraft';

const TITLE_PLACEHOLDER: Record<ListingDraft['category'], string> = {
  Vehicle: 'e.g. 1998 BMW E36 328i Manual',
  Part: 'e.g. Brembo front brake discs, E36',
  Engine: 'e.g. BMW M52B28 engine, 120 000 km',
  Wheel: 'e.g. BBS 17" alloy wheels, set of 4',
  Other: 'e.g. Workshop jack stands',
};

const SellPage = () => {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ListingDraft>(emptyDraft);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedPhotos, setFailedPhotos] = useState(0);
  const navigate = useNavigate();

  const steps = stepsFor(draft.category);
  const current = steps[step];

  const publish = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    setPublishing(true);
    setError(null);

    try {
      const result = await publishListing(draft);
      setFailedPhotos(result.failedPhotos);
      setPublished(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearClientSession();
        navigate('/login');
        return;
      }

      setError(err instanceof Error ? err.message : 'Could not publish your listing. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const update = <K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) =>
    setDraft((currentDraft) => ({ ...currentDraft, [key]: value }));

  const isLast = step === steps.length - 1;
  const canContinue = isStepValid(current.key, draft);

  const toggleDocument = (doc: string, checked: boolean) =>
    update(
      'documents',
      checked ? [...draft.documents, doc] : draft.documents.filter((d) => d !== doc),
    );

  const renderStep = () => {
    switch (current.key) {
      case 'category':
        return <CategoryStep selected={draft.category} onSelect={(c) => update('category', c)} />;
      case 'details':
        return <DetailsStep draft={draft} update={update} />;
      case 'photos':
        return <PhotoUploader photos={draft.photos} onChange={(p) => update('photos', p)} />;
      case 'history':
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
      case 'price':
        return (
          <div className="flex flex-col gap-4">
            <TextField label="Listing title" value={draft.title} placeholder={TITLE_PLACEHOLDER[draft.category]} onChange={(v) => update('title', v)} />
            <TextField label="Asking price (R)" value={draft.price} inputMode="numeric" placeholder="e.g. 85000" onChange={(v) => update('price', v.replace(/\D/g, ''))} />
            <CheckboxField label="Price is negotiable" checked={draft.negotiable} onChange={(c) => update('negotiable', c)} />
            <TextAreaField label="Description" rows={6} value={draft.description} placeholder="Tell buyers what makes this one special" onChange={(v) => update('description', v)} />
          </div>
        );
      default:
        return (
          <dl className="grid grid-cols-1 gap-x-8 gap-y-4 text-sm md:grid-cols-2">
            {reviewRows(draft).map(([label, value]) => (
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
    <>
        <main className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-10">
          <StepSidebar steps={steps} current={step} onSelect={setStep} />

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
                {failedPhotos > 0 && (
                  <p className="text-sm text-amber-300">
                    {failedPhotos} photo{failedPhotos > 1 ? 's' : ''} could not be uploaded.
                  </p>
                )}
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
                      {current.title}
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                      {isLast ? 'Make sure everything looks right.' : 'Tell us about what you\u2019re listing.'}
                    </p>
                  </div>
                  <span className="text-xs text-neutral-500">
                    Step {step + 1} of {steps.length}
                  </span>
                </div>

                <div className="mt-6 sm:mt-8">{renderStep()}</div>

                {error && (
                  <p role="alert" className="mt-4 text-sm text-rose-300">
                    {error}
                  </p>
                )}

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
                    disabled={!canContinue || publishing}
                    onClick={() => (isLast ? void publish() : setStep(step + 1))}
                    className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-display text-sm text-black transition-opacity disabled:opacity-40 light:bg-neutral-900 light:text-white"
                  >
                    {isLast ? (publishing ? 'Publishing…' : 'Publish') : 'Continue'}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </>
            )}
          </section>
        </main>
    </>
  );
};

export default SellPage;
