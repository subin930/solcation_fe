import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import BriefAccount from './BriefAccount';
import TransactionHistory from './components/TransactionHistory';
import { AccountAPI } from '../../services/AccountAPI';
import { useAuth } from '../../context/AuthContext';
import EmptyBear from '../../components/common/EmptyBear';

// 스켈레톤 로딩 컴포넌트
const AccountSkeleton = () => {
  return (
    <div className="w-full bg-gradient-to-br from-third/60 to-third rounded-3xl text-white overflow-hidden animate-pulse">
      {/* 계좌 정보 스켈레톤 */}
      <div className="px-4 py-4 relative">
        <div className="flex flex-col items-start justify-center px-4 gap-1">
          <div className="flex flex-col items-start w-full">
            {/* 은행명 스켈레톤 */}
            <div className="h-4 bg-white/20 rounded w-32 mb-2"></div>
            {/* 계좌번호 스켈레톤 */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-4 bg-white/20 rounded w-40"></div>
              <div className="w-4 h-4 bg-white/20 rounded"></div>
            </div>
          </div>

          {/* 잔액 스켈레톤 */}
          <div className="text-right overflow-hidden w-full">
            <div className="h-6 bg-white/20 rounded w-28 ml-auto"></div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 스켈레톤 */}
      <div className="border-t border-white border-opacity-20">
        <div className="flex">
          <div className="flex-1 py-2 text-center bg-black bg-opacity-10">
            <div className="h-4 bg-white/20 rounded w-8 mx-auto"></div>
          </div>
          <div className="w-px bg-white bg-opacity-20"></div>
          <div className="flex-1 py-2 text-center">
            <div className="h-4 bg-white/20 rounded w-8 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Account = () => {
  const navigate = useNavigate();
  const { groupid } = useParams();
  const { user } = useAuth();
  const [accountInfo, setAccountInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExist, setIsExist] = useState(true);
  const [isGroupLeader, setIsGroupLeader] = useState(false);
  const { groupData, triggerRefresh } = useOutletContext();
  const [shouldLoadTransactions, setShouldLoadTransactions] = useState(false);

  const buttonClass =
    'bg-light-blue text-main px-6 py-2 rounded-lg hover:bg-light-blue/80 transition-colors';

  // 모임통장 정보 조회
  useEffect(() => {
    console.log(groupData);
    const fetchAccountInfo = async () => {
      if (!groupid) return;

      try {
        setIsLoading(true);
        const response = await AccountAPI.getAccountInfo(groupid);
        console.log(response);

        setAccountInfo(response);

        //그룹 정보 저장
        console.log(user);
        if (groupData?.leaderPk === user?.userPk) {
          setIsGroupLeader(true);
        }

        //계좌 존재 여부 저장
        setIsExist(true);
        setShouldLoadTransactions(true);
      } catch (error) {
        console.error('모임통장 정보 조회 실패:', error);

        if (error?.error.code === 40401) {
          setIsExist(false);
          setAccountInfo(null);
          if (groupData?.leaderPk === user?.userPk) {
            setIsGroupLeader(true);
          }

          setShouldLoadTransactions(false);
          return;
        }

        setIsExist(false);
        setAccountInfo(null);
        setShouldLoadTransactions(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountInfo();
  }, [groupid, groupData]);

  console.log('Account 상태:', { isExist, isLoading, accountInfo });

  if ((!isExist || !accountInfo) && !isLoading) {
    console.log('EmptyBear 표시');
    return (
      <>
        <EmptyBear
          title={'앗! 아직 모임통장이 없어요!'}
          description={
            isGroupLeader
              ? `${groupData?.groupName}의 모임통장을 개설해보세요.`
              : `${groupData?.groupLeader}님에게 개설을 요청해보세요.`
          }
          onClick={
            isGroupLeader
              ? () => navigate(`/group/${groupid}/account/new`)
              : null
          }
          buttonText={
            isGroupLeader ? '모임통장 만들기' : '모임통장 개설 요청하기'
          }
          disabledButton={isGroupLeader ? false : true}
        />
      </>
    );
  }

  return (
    <div className="h-[calc(100vh-18rem)] overflow-y-auto">
      <div className="px-4 pt-4">
        {isLoading ? (
          <AccountSkeleton />
        ) : (
          <BriefAccount
            accountInfo={accountInfo}
            isGroupLeader={isGroupLeader}
          />
        )}
      </div>
      {/* 계좌가 존재할 때만 거래내역 표시 */}
      {isExist && (
        <TransactionHistory
          groupId={groupid}
          shouldLoadTransactions={shouldLoadTransactions}
        />
      )}
    </div>
  );
};

export default Account;
