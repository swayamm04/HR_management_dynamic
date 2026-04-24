import React, { forwardRef } from "react";
import { numberToIndianWords } from "@/lib/utils/numberToWords";

interface LineItem {
  roleName: string;
  posts: number;
  days: number;
  rate: number;
  amount: number;
}

interface CompanyDetails {
  name: string;
  gstin: string;
  email: string;
  phone: string;
  hsnCode: string;
  address: string;
  state: string;
  stateCode: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  branch: string;
  swiftCode: string;
  bankRecipientId: string;
  pan: string;
  pfCode: string;
  esicCode: string;
}

interface InvoicePreviewProps {
  company?: CompanyDetails;
  invoiceNumber?: string;
  clientAddress?: string;
  billingMonth?: string;
  lineItems: LineItem[];
  subTotal: number;
  pf: number;
  esi: number;
  totalBeforeService: number;
  service: number;
  cgst?: number;
  sgst?: number;
  grand: number;
  pfRate?: number;
  esiRate?: number;
  serviceRate?: number;
  cgstRate?: number;
  sgstRate?: number;
  roundOff?: number;
  date?: string;
  isGST?: boolean;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>((props, ref) => {
  const { 
    company,
    invoiceNumber, 
    clientAddress, 
    billingMonth, 
    lineItems, 
    subTotal, 
    pf, 
    esi, 
    totalBeforeService, 
    service, 
    cgst = 0,
    sgst = 0,
    grand,
    pfRate = 13,
    esiRate = 3.25,
    serviceRate = 3,
    cgstRate = 9,
    sgstRate = 9,
    date,
    isGST = true
  } = props;

  return (
    <div 
      ref={ref}
      className="w-[210mm] min-h-[297mm] p-[15mm] bg-white text-black font-serif shadow-sm mx-auto"
      style={{ color: '#000' }}
    >
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <h1 className="text-4xl font-extrabold tracking-tighter leading-none mb-1 uppercase">{company?.name || "AKHILA ENTERPRISES"}</h1>
        <p className="text-sm font-bold uppercase tracking-[0.2em] italic">MANPOWER RECRUITMENT AGENCY</p>
      </div>

      {/* Metadata row */}
      <div className="flex justify-between items-start mb-6 text-[11px]">
        <div className="space-y-1">
          <p><span className="font-bold">Bill No.</span> {invoiceNumber || "031U"}</p>
          <p className="font-bold mt-4 underline decoration-solid underline-offset-4">To,</p>
          <div className="whitespace-pre-line leading-relaxed italic pl-0 min-h-[60px]">
            {clientAddress || "Principal,\nMorarji Desai Residential School,\nBabybetta (Basavanagudikoppalu),\nPandavapura (T)\nMandya (D)."}
          </div>
        </div>
        <div className="text-right space-y-0.5">
          <p><span className="font-bold">Date:</span> {date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')}</p>
          <p className="pt-2"><span className="font-bold text-[10px]">Bank Recipient ID :</span> {company?.bankRecipientId || "3000137776"}</p>
          <p><span className="font-bold uppercase">PAN :</span> {company?.pan || "ABIFA9390C"}</p>
          <p><span className="font-bold uppercase">GST :</span> {company?.gstin || "29ABIFA9390CIZ7"}</p>
          <p><span className="font-bold uppercase">PF Code :</span> {company?.pfCode || "KN/SHG/40327"}</p>
          <p><span className="font-bold uppercase text-[10px]">ESIC Code :</span> {company?.esicCode || "58000014810001001"}</p>
        </div>
      </div>

      {/* Invoice Title */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold border-b-2 border-black inline-block px-4 pb-1">
          Credit Bill / Service Bill for the month of {billingMonth || "[Month Year]"}
        </h2>
      </div>

      {/* Items Table */}
      <table className="w-full border-2 border-black text-[12px] border-collapse mb-1">
        <thead>
          <tr className="border-b-2 border-black bg-slate-50">
            <th className="border-r-2 border-black p-1 w-10 text-center">SI. No.</th>
            <th className="border-r-2 border-black p-1 text-left">Particular of Service</th>
            <th className="border-r-2 border-black p-1 w-16 text-center">No.of Posts</th>
            <th className="border-r-2 border-black p-1 w-16 text-center">No.of Days</th>
            <th className="border-r-2 border-black p-1 w-24 text-center" colSpan={2}>Rate</th>
            <th className="p-1 w-28 text-center" colSpan={2}>Amount</th>
          </tr>
          <tr className="border-b-2 border-black bg-slate-50">
            <th className="border-r-2 border-black p-0 h-4" colSpan={4}></th>
            <th className="border-r-2 border-black p-0 text-[10px] w-12 text-center">Rs</th>
            <th className="border-r-2 border-black p-0 text-[10px] w-8 text-center">Ps</th>
            <th className="border-r-2 border-black p-0 text-[10px] w-20 text-center">Rs</th>
            <th className="p-0 text-[10px] w-8 text-center">Ps</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-black">
          {lineItems.map((item, idx) => {
            const rs = Math.floor(item.rate);
            const ps = Math.round((item.rate % 1) * 100);
            const amountRs = Math.floor(item.amount);
            const amountPs = Math.round((item.amount % 1) * 100);
            
            return (
              <tr key={idx} className="h-8">
                <td className="border-r-2 border-black p-1 text-center">{idx + 1}</td>
                <td className="border-r-2 border-black p-1">Providing Of {item.roleName}</td>
                <td className="border-r-2 border-black p-1 text-center">{item.posts.toString().padStart(2, '0')}</td>
                <td className="border-r-2 border-black p-1 text-center">{item.days.toString().padStart(2, '0')}</td>
                <td className="border-r-2 border-black p-1 text-right pr-2">{rs.toLocaleString()}</td>
                <td className="border-r-2 border-black p-1 text-center">{ps.toString().padStart(2, '0')}</td>
                <td className="border-r-2 border-black p-1 text-right pr-2 font-bold">{amountRs.toLocaleString()}</td>
                <td className="p-1 text-center font-bold">{amountPs.toString().padStart(2, '0')}</td>
              </tr>
            );
          })}
          <tr className="border-t-2 border-black font-bold h-7 bg-slate-100/50">
            <td className="border-r-2 border-black p-1 text-right pr-4" colSpan={6}>Total</td>
            <td className="border-r-2 border-black p-1 text-right pr-2">{Math.floor(subTotal).toLocaleString()}</td>
            <td className="p-1 text-center">{(Math.round((subTotal % 1) * 100)).toString().padStart(2, '0')}</td>
          </tr>
          <tr className="h-7 text-[11px]">
            <td className="border-r-2 border-black p-1 pl-4" colSpan={6}>PF . {pfRate}%</td>
            <td className="border-r-2 border-black p-1 text-right pr-2">{Math.floor(pf).toLocaleString()}</td>
            <td className="p-1 text-center">{(Math.round((pf % 1) * 100)).toString().padStart(2, '0')}</td>
          </tr>
          <tr className="h-7 text-[11px] border-b-2 border-black">
            <td className="border-r-2 border-black p-1 pl-4" colSpan={6}>ESI . {esiRate}%</td>
            <td className="border-r-2 border-black p-1 text-right pr-2">{Math.floor(esi).toLocaleString()}</td>
            <td className="p-1 text-center">{(Math.round((esi % 1) * 100)).toString().padStart(2, '0')}</td>
          </tr>
          <tr className="font-bold h-7 bg-slate-100/50 border-b-2 border-black text-[11px]">
            <td className="border-r-2 border-black p-1 text-right pr-4 uppercase" colSpan={6}>Total (Basic + PF + ESI)</td>
            <td className="border-r-2 border-black p-1 text-right pr-2">{Math.floor(totalBeforeService).toLocaleString()}</td>
            <td className="p-1 text-center">{(Math.round((totalBeforeService % 1) * 100)).toString().padStart(2, '0')}</td>
          </tr>
          <tr className="h-7 text-[11px] border-b-2 border-black">
            <td className="border-r-2 border-black p-1 pl-4 uppercase" colSpan={6}>Service Charge {serviceRate}%</td>
            <td className="border-r-2 border-black p-1 text-right pr-2">{Math.floor(service).toLocaleString()}</td>
            <td className="p-1 text-center">{(Math.round((service % 1) * 100)).toString().padStart(2, '0')}</td>
          </tr>
          <tr className="font-bold h-7 bg-slate-100/50 border-b-2 border-black text-[11px]">
            <td className="border-r-2 border-black p-1 text-right pr-4 uppercase" colSpan={6}>Total {isGST && "(Taxable Value)"}</td>
            <td className="border-r-2 border-black p-1 text-right pr-2">{Math.floor(totalBeforeService + service).toLocaleString()}</td>
            <td className="p-1 text-center">{(Math.round(((totalBeforeService + service) % 1) * 100)).toString().padStart(2, '0')}</td>
          </tr>
          {isGST && (
            <>
              <tr className="h-7 border-b-2 border-black text-[11px]">
                <td className="border-r-2 border-black p-1 pl-4 uppercase" colSpan={6}>CGST {cgstRate}%</td>
                <td className="border-r-2 border-black p-1 text-right pr-2">{Math.floor(cgst).toLocaleString()}</td>
                <td className="p-1 text-center">{(Math.round((cgst % 1) * 100)).toString().padStart(2, '0')}</td>
              </tr>
              <tr className="h-7 border-b-2 border-black text-[11px]">
                <td className="border-r-2 border-black p-1 pl-4 uppercase" colSpan={6}>SGST {sgstRate}%</td>
                <td className="border-r-2 border-black p-1 text-right pr-2">{Math.floor(sgst).toLocaleString()}</td>
                <td className="p-1 text-center">{(Math.round((sgst % 1) * 100)).toString().padStart(2, '0')}</td>
              </tr>
            </>
          )}
          {props.roundOff !== 0 && (
            <tr className="h-7 border-b-2 border-black text-[11px] italic">
              <td className="border-r-2 border-black p-1 pl-4 uppercase" colSpan={6}>Round Off</td>
              <td className="border-r-2 border-black p-1 text-right pr-2">
                {props.roundOff! > 0 ? "+" : ""}{Math.abs(Math.floor(props.roundOff!))}
              </td>
              <td className="p-1 text-center">
                {Math.abs(Math.round((props.roundOff! % 1) * 100)).toString().padStart(2, '0')}
              </td>
            </tr>
          )}
          <tr className="font-extrabold h-8 bg-slate-200 border-b-2 border-black">
            <td className="border-r-2 border-black p-1 text-right pr-4 uppercase" colSpan={4}>Grand Total</td>
            <td className="border-r-2 border-black p-1 text-center">{lineItems.reduce((sum, i) => sum + i.posts, 0).toString().padStart(2, '0')}</td>
            <td className="border-r-2 border-black p-1"></td>
            <td className="border-r-2 border-black p-1 text-right pr-2 text-base">{Math.floor(grand).toLocaleString()}</td>
            <td className="p-1 text-center text-base">{(Math.round((grand % 1) * 100)).toString().padStart(2, '0')}</td>
          </tr>
        </tbody>
      </table>

      {/* Amount in words */}
      <div className="border-2 border-black p-2 mt-2 text-[11px] bg-slate-50 min-h-[40px]">
        <span className="font-bold">Rupees in words:</span> <span className="font-bold italic">{numberToIndianWords(grand)}</span>
      </div>

      {/* Note section */}
      <div className="text-[9px] mt-4 leading-tight italic">
        <p>Please pay the above mentioned Bill amount to above Bank Recipient ID or issue Cheque/D.D. in favours of M/s. {company?.name || "Akhila Enterprises"}. As per the tender agreement executed to be Re-embursed the above payment with in stipulated period of EPF, ESI, and GST mandatory payments which avoids intrest penal damages & other penalties. Hence pass for the payment on top priority basis.</p>
      </div>

      {/* Footer signatures */}
      <div className="mt-10 flex justify-between text-[11px]">
        <div className="space-y-4">
          <p className="font-bold">Thanking you,</p>
          <p className="font-bold">Yours faithfully</p>
        </div>
        <div className="text-center space-y-4 pr-10">
          <p className="font-bold underline decoration-solid underline-offset-4 decoration-2">for {company?.name || "Akhila Enterprises"}</p>
          <div className="pt-8 font-bold">Authorized Signature</div>
        </div>
      </div>

      {/* Official Footer line */}
      <div className="mt-12 pt-1 border-t-2 border-black text-center text-[10px] font-bold">
        Reg. Office : {company?.address || "Bharmappa Nagara, 2nd Cross, SHIVAMOGGA-577 202."}
        <br />
        {company?.phone && `Mob. : ${company.phone}, `} email : {company?.email || "ae.shimoga@gmail.com"}
      </div>
    </div>
  );
});

InvoicePreview.displayName = "InvoicePreview";
