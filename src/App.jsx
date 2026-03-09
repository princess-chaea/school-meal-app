import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Utensils, ChevronLeft, ChevronRight, MapPin, AlertCircle, Loader2 } from 'lucide-react';

const API_KEY = '04f275416e194b508bbd3ad51e42d887';

// 날짜를 YYYYMMDD 형식의 문자열로 변환하는 헬퍼 함수
const formatDateStr = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

export default function App() {
  const [school, setSchool] = useState(null); // { officeCode, schoolCode, schoolName, address }

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyMeals, setMonthlyMeals] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // view 모드 감지 (widget vs full)
  const [viewMode, setViewMode] = useState('full');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('view') || 'full';
    setViewMode(mode);
  }, []);

  // 앱 실행 시 하주초등학교 정보 자동 설정
  useEffect(() => {
    const initHajuSchool = async () => {
      try {
        // 하주초등학교 검색 API 호출
        const url = `https://open.neis.go.kr/hub/schoolInfo?KEY=${API_KEY}&Type=json&SCHUL_NM=${encodeURIComponent('하주초등학교')}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.schoolInfo && data.schoolInfo[1].row) {
          const haju = data.schoolInfo[1].row.find(s => s.SCHUL_NM === '하주초등학교');
          if (haju) {
            setSchool({
              officeCode: haju.ATPT_OFCDC_SC_CODE,
              schoolCode: haju.SD_SCHUL_CODE,
              schoolName: haju.SCHUL_NM,
              address: haju.ORG_RDNMA
            });
          }
        }
      } catch (err) {
        console.error('학교 정보를 불러오는 중 오류 발생:', err);
      }
    };

    initHajuSchool();
  }, []);

  // 학교가 설정되고 월이 바뀔 때마다 해당 월의 급식 데이터를 가져옴
  useEffect(() => {
    if (!school) return;
    fetchMonthlyMeals(school.officeCode, school.schoolCode, currentDate);
  }, [school, currentDate]);

  const fetchMonthlyMeals = async (officeCode, schoolCode, date) => {
    setLoading(true);
    setError('');
    try {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(yyyy, date.getMonth() + 1, 0).getDate();
      const fromYmd = `${yyyy}${mm}01`;
      const toYmd = `${yyyy}${mm}${lastDay}`;

      const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_FROM_YMD=${fromYmd}&MLSV_TO_YMD=${toYmd}&pSize=100`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.mealServiceDietInfo && data.mealServiceDietInfo[1].row) {
        const meals = data.mealServiceDietInfo[1].row;
        const mealsByDate = {};

        meals.forEach(meal => {
          const ymd = meal.MLSV_YMD;
          if (!mealsByDate[ymd]) mealsByDate[ymd] = [];

          // 알레르기 정보(숫자) 및 특수문자 제거 후 배열로 변환
          const cleanDishes = meal.DDISH_NM.split('<br/>')
            .map(d => d.replace(/\([^)]+\)/g, '').replace(/[^가-힣a-zA-Z0-9\s]/g, '').trim())
            .filter(Boolean);

          mealsByDate[ymd].push({
            type: meal.MMEAL_SC_NM, // 조식, 중식, 석식
            dishes: cleanDishes,
            calories: meal.CAL_INFO
          });
        });
        setMonthlyMeals(mealsByDate);
      } else {
        setMonthlyMeals({});
      }
    } catch (err) {
      setError('급식 정보를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  // 위젯 전용 뷰 렌더링
  if (viewMode === 'widget') {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-2">
        <div className="w-full max-w-sm space-y-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-orange-500 p-4 text-white text-center">
              <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 식단
              </h2>
              <p className="text-orange-100 text-xs mt-0.5">
                하주초등학교 {['일', '월', '화', '수', '목', '금', '토'][selectedDate.getDay()]}요일
              </p>
            </div>

            <div className="p-4 bg-white">
              {!school || loading ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500 mb-2" />
                  <p className="text-sm">불러오는 중...</p>
                </div>
              ) : error ? (
                <div className="text-center py-6 text-red-400">
                  <p className="text-sm">{error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {monthlyMeals[formatDateStr(selectedDate)] ? (
                    monthlyMeals[formatDateStr(selectedDate)].map((meal, idx) => (
                      <div key={idx} className="bg-orange-50/30 rounded-xl p-3 border border-orange-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full text-xs">
                            {meal.type}
                          </span>
                          <span className="text-[10px] text-gray-400">{meal.calories}</span>
                        </div>
                        <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                          {meal.dishes.map((dish, i) => (
                            <li key={i} className="text-gray-700 text-sm flex items-start gap-1">
                              <span className="text-orange-300">•</span>
                              <span className="truncate">{dish}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">급식 정보가 없습니다.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-gray-50 bg-gray-50/50 flex justify-center">
              <a 
                href={`${window.location.origin}${window.location.pathname}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                전체 달력 보기
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-bold text-gray-900">하주초등학교 급식</h1>
          </div>
          {school && (
            <div className="flex items-center gap-1 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4 text-orange-500" />
              {school.address}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">

        {/* 왼쪽: 선택된 날짜의 급식 정보 (오늘의 급식) */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-orange-500 p-6 text-white text-center">
              <h2 className="text-2xl font-bold">
                {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
              </h2>
              <p className="text-orange-100 mt-1 font-medium">
                {['일', '월', '화', '수', '목', '금', '토'][selectedDate.getDay()]}요일 식단표
              </p>
            </div>

            <div className="p-6">
              {!school ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
                  <p>학교 정보를 불러오는 중...</p>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
                  <p>식단을 불러오는 중...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-10 text-red-400">
                  <AlertCircle className="w-10 h-10 mb-2" />
                  <p className="text-sm">{error}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {monthlyMeals[formatDateStr(selectedDate)] ? (
                    monthlyMeals[formatDateStr(selectedDate)].map((meal, idx) => (
                      <div key={idx} className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-orange-800 bg-orange-100 px-3 py-1 rounded-full text-sm">
                            {meal.type}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">{meal.calories}</span>
                        </div>
                        <ul className="space-y-2">
                          {meal.dishes.map((dish, i) => (
                            <li key={i} className="text-gray-700 flex items-start gap-2">
                              <span className="text-orange-300 mt-0.5">•</span>
                              <span className="font-medium">{dish}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <Utensils className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>등록된 급식 정보가 없습니다.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽: 월별 달력 */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-gray-400" />
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
              </h3>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => {
                    setCurrentDate(new Date());
                    setSelectedDate(new Date());
                  }}
                  className="px-4 py-1.5 text-sm font-medium hover:bg-gray-100 rounded-full transition-colors"
                >
                  오늘
                </button>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                <div key={day} className={`text-center font-semibold text-sm py-2 ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-500'}`}>
                  {day}
                </div>
              ))}
            </div>

            <CalendarGrid
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDayClick={handleDayClick}
              monthlyMeals={monthlyMeals}
            />
          </div>
        </div>
      </main>
    </div>
  );
}


// 달력 그리드 컴포넌트
function CalendarGrid({ currentDate, selectedDate, onDayClick, monthlyMeals }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  // 빈 칸 채우기
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }

  // 날짜 채우기
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected = selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === d;

    const isToday = new Date().getFullYear() === year &&
      new Date().getMonth() === month &&
      new Date().getDate() === d;

    const dateStr = `${year}${String(month + 1).padStart(2, '0')}${String(d).padStart(2, '0')}`;
    const hasMeal = !!monthlyMeals[dateStr];

    days.push(
      <button
        key={d}
        onClick={() => onDayClick(d)}
        className={`
          relative min-h-[4rem] p-2 rounded-xl flex flex-col items-center justify-start transition-all border
          ${isSelected ? 'border-orange-500 bg-orange-50/50 shadow-sm text-orange-600' : 'border-transparent hover:bg-gray-50 hover:border-gray-200'}
        `}
      >
        <span className={`
          text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full
          ${isToday && !isSelected ? 'bg-gray-800 text-white' : ''}
          ${isSelected ? 'bg-orange-500 text-white' : ''}
        `}>
          {d}
        </span>

        {/* 급식 유무 표시 뱃지 */}
        {hasMeal && (
          <div className="mt-1 flex gap-1">
            {monthlyMeals[dateStr].map((m, idx) => (
              <span key={idx} className="w-1.5 h-1.5 rounded-full bg-green-400" title={m.type}></span>
            ))}
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {days}
    </div>
  );
}
