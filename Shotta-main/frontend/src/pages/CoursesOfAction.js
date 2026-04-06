import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { ChevronDown, ChevronUp } from "lucide-react";
import GovHeader from "../components/GovHeader";
import GovFooter from "../components/GovFooter";

const CoursesOfAction = ({ userProfile }) => {
  const navigate = useNavigate();
  const [criminalOpen, setCriminalOpen] = useState(false);
  const [civilOpen, setCivilOpen] = useState(false);
  const [showSurrenderDialog, setShowSurrenderDialog] = useState(false);

  const handleCriminalAction = () => {
    setShowSurrenderDialog(true);
  };

  const handleConfirmSurrender = () => {
    setShowSurrenderDialog(false);
    navigate("/self-surrender");
  };

  const handleCivilAction = () => {
    navigate("/payment-methods");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      
      <div className="border-b-4 border-[#1a4480]" />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1b1b1b] mb-2">
          Courses of Action
        </h1>
        <p className="text-[#71767a] mb-6 sm:mb-8 text-sm sm:text-base">
          Select one of the following courses of action to resolve your outstanding obligations.
        </p>

        {/* Criminal Course of Action */}
        <div className="bg-white border border-[#dfe1e2] rounded-sm shadow-sm mb-4 overflow-hidden">
          <Collapsible open={criminalOpen} onOpenChange={setCriminalOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-[#f0f0f0] transition-colors">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1a4480]">
                    Criminal Course of Action
                  </h2>
                  <p className="text-xs sm:text-sm text-[#71767a] mt-1">
                    Self-Surrender to Law Enforcement
                  </p>
                </div>
                {criminalOpen ? (
                  <ChevronUp className="h-5 w-5 sm:h-6 sm:w-6 text-[#1a4480]" />
                ) : (
                  <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-[#1a4480]" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-[#dfe1e2] pt-4">
                <div className="bg-[#faf3d1] border-l-4 border-[#b38600] p-3 sm:p-4 mb-4">
                  <p className="text-[#1b1b1b] text-sm sm:text-base leading-relaxed">
                    By choosing this course of action, you are voluntarily surrendering yourself to 
                    law enforcement authorities. You will be held in custody for <strong>up to 45 days</strong> while 
                    awaiting your appearance before an Honorable Court Judge. This is a formal legal 
                    proceeding and your rights will be fully explained upon surrender.
                  </p>
                </div>
                <ul className="text-sm text-[#1b1b1b] space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#d83933] mt-0.5">•</span>
                    <span>Maximum detention period: 45 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d83933] mt-0.5">•</span>
                    <span>Appearance before Honorable Court Judge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d83933] mt-0.5">•</span>
                    <span>Full legal representation available</span>
                  </li>
                </ul>
                <Button
                  onClick={handleCriminalAction}
                  className="w-full sm:w-auto rounded-sm bg-[#d83933] hover:bg-[#b72f2a] text-white py-3 px-6 text-sm font-bold"
                  data-testid="criminal-action-btn"
                >
                  CHOOSE THIS COURSE OF ACTION
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Civil Course of Action */}
        <div className="bg-white border border-[#dfe1e2] rounded-sm shadow-sm overflow-hidden">
          <Collapsible open={civilOpen} onOpenChange={setCivilOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-[#f0f0f0] transition-colors">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#2e8540]">
                    Civil Course of Action
                  </h2>
                  <p className="text-xs sm:text-sm text-[#71767a] mt-1">
                    Surety Bond Payment Procedure
                  </p>
                </div>
                {civilOpen ? (
                  <ChevronUp className="h-5 w-5 sm:h-6 sm:w-6 text-[#2e8540]" />
                ) : (
                  <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-[#2e8540]" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-[#dfe1e2] pt-4">
                <div className="bg-[#e7f4e9] border-l-4 border-[#2e8540] p-3 sm:p-4 mb-4">
                  <p className="text-[#1b1b1b] text-sm sm:text-base leading-relaxed">
                    By choosing the civil course of action, you may resolve your outstanding obligations 
                    on your own accord through a <strong>surety bond payment</strong>. This procedure allows you to 
                    satisfy your financial obligations without the need for custody or formal court appearance. 
                    Multiple payment methods are available for your convenience.
                  </p>
                </div>
                <ul className="text-sm text-[#1b1b1b] space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#2e8540] mt-0.5">•</span>
                    <span>No custody or detention required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2e8540] mt-0.5">•</span>
                    <span>Multiple secure payment options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2e8540] mt-0.5">•</span>
                    <span>Immediate resolution upon payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2e8540] mt-0.5">•</span>
                    <span>Immediate reimbursement upon civil case dismissal</span>
                  </li>
                </ul>
                <Button
                  onClick={handleCivilAction}
                  className="w-full sm:w-auto rounded-sm bg-[#2e8540] hover:bg-[#236b34] text-white py-3 px-6 text-sm font-bold"
                  data-testid="civil-action-btn"
                >
                  CHOOSE THIS COURSE OF ACTION
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="mt-6">
          <Button
            onClick={() => navigate("/results")}
            variant="ghost"
            className="text-[#1a4480] hover:text-[#162e51] text-sm font-semibold p-0"
          >
            ← Back to Status
          </Button>
        </div>
      </div>

      {/* Self-Surrender Confirmation Dialog */}
      <AlertDialog open={showSurrenderDialog} onOpenChange={setShowSurrenderDialog}>
        <AlertDialogContent className="rounded-sm border-[#dfe1e2] max-w-md mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-[#d83933]">
              Confirm Self-Surrender
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#1b1b1b] text-base">
              Are you sure you want to self-surrender? This action will require you to report to 
              your nearest law enforcement office immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="rounded-sm border-[#1b1b1b] text-[#1b1b1b]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmSurrender}
              className="rounded-sm bg-[#d83933] hover:bg-[#b72f2a] text-white"
            >
              Yes, I Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <GovFooter />
    </div>
  );
};

export default CoursesOfAction;
